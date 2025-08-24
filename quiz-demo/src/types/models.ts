export type QuizId = 'code' | 'concepts';

export interface Question {
  sectionKey: string;
  promptText: string;
  code?: { content: string }; // TSX content
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

export interface QuizDependency {
  quizId: QuizId;
  mustBePerfect?: boolean;
}

export interface Quiz {
  id: QuizId;
  title: string;
  description?: string;
  isOrdered: boolean;
  dependsOn?: QuizDependency[];
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
  seed?: number;
}


