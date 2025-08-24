import type { Quiz, QuizId } from '../types/models'
import { codeQuiz } from './code'
import { conceptsQuiz } from './concepts'

export const quizzesById: Record<QuizId, Quiz> = {
  code: codeQuiz,
  concepts: conceptsQuiz,
}

export const allQuizzes: Quiz[] = Object.values(quizzesById)


