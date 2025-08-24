import type { Quiz } from '../types/models'

export const conceptsQuiz: Quiz = {
  id: 'concepts',
  title: 'Concepts Quiz',
  description: 'Core concepts: phases, ordering, and effects timing.',
  isOrdered: false,
  dependsOn: [{ quizId: 'code', mustBePerfect: true }],
  questions: [
    {
      sectionKey: 'Effect vs LayoutEffect',
      promptText: 'Which runs first in the commit phase?',
      options: [
        'useLayoutEffect runs before useEffect',
        'useEffect runs before useLayoutEffect',
        'Both run simultaneously',
        'Neither runs in commit',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'Render cycle phases',
      promptText: 'Which list correctly orders the phases on the first render?',
      options: [
        'update → useLayoutEffects → useEffects',
        'useLayoutEffects → update → useEffects',
        'update → useEffects → useLayoutEffects',
        'useEffects → update → useLayoutEffects',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'Cleanup timing',
      promptText: 'On unmount, which cleanup order is correct?',
      options: [
        'useLayoutEffect cleanup → useEffect cleanup',
        'useEffect cleanup → useLayoutEffect cleanup',
        'No cleanups run on unmount',
        'Both run simultaneously',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'Updates vs Renders',
      promptText: 'Setting state in the component body during update causes…',
      options: [
        'Another update call before effects',
        'Immediate DOM paint without effects',
        'Only a useEffect call',
        'Only layout effects, no update',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'Effects scheduling',
      promptText: 'Setting state inside useEffect schedules…',
      options: [
        'A new render cycle (update → commit → effects)',
        'Only a layout effect, no render',
        'Only an update call, no commit',
        'No additional work; effects don’t schedule renders',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'Tree-wide phases',
      promptText: 'During a given phase (e.g., useEffect), which statement is true?',
      options: [
        'The whole React tree is in that phase before moving on',
        'Each component can be in different phases simultaneously',
        'Siblings interleave update and effects arbitrarily',
        'Parents run effects before children update',
      ],
      correctIndex: 0,
    },
    {
      sectionKey: 'Ordering within a component',
      promptText: 'Effects of the same type within a component run in…',
      options: [
        'Declaration order',
        'Reverse declaration order',
        'Random order',
        'Alphabetical order by variable name',
      ],
      correctIndex: 0,
    },
  ],
}


