import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Attempt, QuizId } from '../types/models'

type SelectedMap = Record<number, 0 | 1 | 2 | 3 | null>

export interface QuizState {
  status: 'idle' | 'in_quiz' | 'show_results'
  activeQuizId: QuizId | null
  currentIndex: number
  selectedOption: 0 | 1 | 2 | 3 | null
  score: { numCorrect: number; answered: number }
  attempts: Attempt[]
  session?: {
    quizId: QuizId
    index: number
    selected: SelectedMap
    seed?: number
  }
}

const initialState: QuizState = {
  status: 'idle',
  activeQuizId: null,
  currentIndex: 0,
  selectedOption: null,
  score: { numCorrect: 0, answered: 0 },
  attempts: [],
}

export const useQuizStore = create<QuizState>()(
  persist(
    () => ({ ...initialState }),
    {
      name: 'quiz',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        status: state.status,
        activeQuizId: state.activeQuizId,
        currentIndex: state.currentIndex,
        selectedOption: state.selectedOption,
        score: state.score,
        attempts: state.attempts,
        session: state.session,
      }),
    }
  )
)


