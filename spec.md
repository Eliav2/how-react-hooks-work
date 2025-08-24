# Quiz App Specification

## Overview
- **Working name**: TBD (e.g., "Pick4")
- **Goal**: Single-page quiz app based on demos from `README.md` about React Hooks and the render cycle. Users answer 4-choice questions. The app reports overall score per attempt without revealing which specific questions were wrong.
- **Tech**: Vite + React, MUI v7, Zustand (persist middleware) for state/localStorage, syntax highlighting for code snippets, confetti on perfect score.

## Non-Goals (v1)
- No backend/authentication
- No per-question review or explanations after submission (by design)
- No routing; strictly SPA without URL-based navigation

## Functional Requirements
1. **Single-page application**
  - Two primary views controlled by app state:
    - Start Screen (landing + history)
    - Quiz Screen (in-progress)
  - Optional lightweight Results dialog/panel at finish/quit.

2. **Start Screen**
  - Shows attempt history list (timestamp + score only, e.g., "8/12", plus quiz name).
  - Two quiz entries (defined as separate modules):
    - "Code Quiz" (always available). Uses all code questions (fixed order).
    - "Concepts Quiz" (locked until its dependency is met per quiz config; by default depends on a perfect Code completion). Uses all concept questions (shuffled order).
  - If the user has achieved any 100% score, display a celebratory banner/badge on this screen.

3. **Quiz Screen**
  - Displays current question index and a range/progress view showing remaining questions:
    - Linear progress bar + caption like "Q 3 of 12" and "Left: 9" (range-like view of how many questions are left).
  - Question area:
    - Text prompt supporting inline code and links to the article.
    - Optional code block with syntax highlighting (assume TSX for code blocks).
  - Four multiple-choice options (1–4). Single selection required.
  - Controls:
    - Next: advances to next question; disabled until an option is selected.
    - Quit: ends the current quiz immediately and shows overall results for answered questions only.
  - No immediate per-question correctness feedback.

4. **Finish / Quit Behavior**
  - On Finish (last question) or Quit (mid-quiz), show a Result summary:
    - Correct count vs total answered (and total in quiz when finished).
    - Do not reveal which questions were wrong.
  - Persist attempt summary in localStorage.
  - If the user scored 100%, trigger confetti and record a "perfect" flag.
  - If the user scored 100% on Code Quiz, unlock Concepts Quiz.

5. **Persistence (localStorage)**
  - Attempts stored with aggregate data only (no per-question correctness surfaced).
  - Resume in-progress sessions after refresh.

## Content Scope
- Topics from the article: Definitions, Render cycle phases, Effect vs LayoutEffect, Update vs Render cycles, ordering rules, unmount behavior, best practices.
- Question types:
  - Conceptual understanding (e.g., phase ordering)
  - Behavior prediction (e.g., log order in Basic/BasicReverse)
  - Best practices (e.g., avoid state updates in FC body)

## Data Model
```ts
// Type-safe quiz identifiers
export type QuizId = 'code' | 'concepts';

export interface Question {
  id: string;
  sectionKey: string; // e.g., 'render-cycle', 'effects-vs-layout'
  promptText: string; // supports basic markdown/inline code
  code?: { content: string }; // assume TSX
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface QuizDependency {
  quizId: QuizId;
  mustBePerfect?: boolean; // default false; if true, requires a perfect attempt
}

export interface Quiz {
  id: QuizId;
  title: string;
  description?: string;
  isOrdered: boolean; // true: fixed order (Code); false: shuffled per attempt (Concepts)
  dependsOn?: QuizDependency[]; // all conditions must be satisfied to unlock
  questions: Question[];
}

export interface Attempt {
  id: string;
  timestamp: number;
  quizId: QuizId;
  totalQuestions: number;
  answeredQuestions: number;
  numCorrect: number;
  perfect: boolean;
  seed?: number; // used for unordered quizzes to reproduce question order
}
```

## State Management
- Use **Zustand** with the `persist` middleware to keep all app state in a single store, saved to localStorage under the `quiz` key.
- Prefer calling `store.setState` for updates (no dedicated action methods per slice for v1 simplicity).
- State includes: `status`, `activeQuizId: QuizId`, `currentIndex`, `selectedOption`, `score`, `attempts`, and in-progress `session` fields as needed.

## Storage Schema (localStorage)
- `quiz` (JSON object, owned by the Zustand persisted store):
  - `attempts: Attempt[]`
  - `session?: { quizId: QuizId, index: number, selected: Record<number, 0|1|2|3|null>, seed?: number }`
  - Unlock state for each quiz is derived at runtime from `attempts` and the quiz's `dependsOn` configuration.

## UI/UX Details
- Theme: MUI v7 default (light)
- Components (MUI):
  - AppBar/Toolbar for title and progress context
  - Container/Grid for layout
  - LinearProgress (percent complete) + caption (left count)
  - Card for Question
  - RadioGroup (or ToggleButtonGroup) for options 1–4
  - Buttons: Next (primary), Quit (text)
  - Dialog/Alert for results
  - Start Screen tiles/buttons for quizzes; a tile is disabled if its `dependsOn` conditions are not met (tooltip explains condition, e.g., "Finish Code with 100% to unlock Concepts").
- Code blocks: use `react-syntax-highlighter` (Prism) with a TSX theme.
- Confetti: `canvas-confetti` on perfect finish; small burst on Start Screen if any perfect attempt exists.
- Accessibility: keyboard nav for options, ARIA labels for progress and question text.

## Ordering & Selection
- All questions are always included per quiz run (no maximum cap).
- For an ordered quiz (`isOrdered: true`): use the questions' defined order (Code Quiz).
- For unordered quiz (`isOrdered: false`): shuffle question order per attempt; generate a stable `seed` and preserve it in session for resume (Concepts Quiz).
- Options order: randomized per question (stable within an attempt); optional.

## App Flow / State
- `status: 'idle' | 'in_quiz' | 'show_results'`
- `activeQuizId: QuizId`
- `currentIndex: number`
- `selectedOption: 0|1|2|3|null`
- `score: { numCorrect: number; answered: number }`
- On app mount: hydrate Zustand store from localStorage (`quiz` key). If session indicates `in_quiz`, always resume that session.
- From Start:
  - List all quizzes from `quizzes/` modules. For each quiz, compute unlock by testing its `dependsOn` against attempts (e.g., Concepts requires `{ quizId: 'code', mustBePerfect: true }`).
  - Start quiz -> `in_quiz` with ordering per `isOrdered` and `seed` generation when needed.
- Transitions during quiz:
  - Select option -> enable Next
  - Next -> evaluate selection, update score, advance index
  - Quit -> `show_results` (denominator = answered)
  - Finish -> `show_results` (denominator = total)
  - Results -> `idle`

## Scoring & Privacy
- Evaluate correctness only when advancing/finishing.
- Persist and show aggregate counts only.
- Never reveal per-question correctness or correct answers post-quiz.

## Error/Edge Cases
- Double-clicks on Next prevented by disabled state.
- Refresh mid-quiz resumes in-progress session (hydrated from Zustand `quiz` store) with the same `seed` and ordering.
- Concepts Quiz blocked (disabled UI) until Code perfect achieved; show tooltip explaining unlock condition.

## Performance
- Small embedded question bank. Use `useMemo` for derived lists. Keep selection state local to question card to reduce re-renders.

## Packages
- `react`, `react-dom`
- `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled` (MUI v7)
- `zustand` (with `zustand/middleware/persist`)
- `react-syntax-highlighter`
- `canvas-confetti`
- `uuid`

## Project Structure (proposed)
- `src/`
  - `App.tsx`
  - `components/`
    - `StartScreen.tsx`
    - `QuizScreen.tsx`
    - `QuestionCard.tsx`
    - `ProgressBar.tsx`
    - `ResultsDialog.tsx`
  - `quizzes/`
    - `code.ts` (exports `codeQuiz: Quiz` with `id: 'code'`, `isOrdered: true`)
    - `concepts.ts` (exports `conceptsQuiz: Quiz` with `id: 'concepts'`, `isOrdered: false`, `dependsOn: [{ quizId: 'code', mustBePerfect: true }]`)
    - `index.ts` (exports all quizzes as a map `{ [id in QuizId]: Quiz }`)
  - `lib/`
    - `store.ts` (Zustand persisted store)
    - `confetti.ts`
  - `types/`
    - `models.ts` (Question, QuizId, Quiz, Attempt)

## Definition of Done (v1)
- Start Screen shows history with quiz names, perfect badge, and quiz entries obeying `dependsOn` for unlock.
- Code Quiz runs with fixed ordering; Concepts Quiz runs with shuffled ordering (stable per attempt for resume).
- Results show only aggregate counts; attempts saved to localStorage.
- Confetti on 100% finish; banner if any perfect attempt exists; Concepts unlocks based on its `dependsOn` config.
- Always resume in-progress session after refresh.
- Clean, accessible MUI UI; no runtime errors.
