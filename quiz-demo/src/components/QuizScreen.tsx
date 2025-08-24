import { Button, Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { ProgressBar } from './ProgressBar'
import { QuestionCard } from './QuestionCard'
import { useQuizStore } from '../lib/store'
import { quizzesById } from '../quizzes'
import type { Quiz } from '../types/models'
import { v4 as uuid } from 'uuid'

function shuffle<T>(arr: T[], seed: number) {
  // Simple deterministic shuffle (mulberry32)
  function mulberry32(a: number) {
    return function () {
      let t = (a += 0x6d2b79f5)
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }
  const rng = mulberry32(seed)
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function QuizScreen({ onFinish }: { onFinish: () => void }) {
  const { activeQuizId, currentIndex, session, score } = useQuizStore()
  const setState = useQuizStore.setState
  const quiz: Quiz | undefined = activeQuizId ? quizzesById[activeQuizId] : undefined

  const [questionOrder, seed] = useMemo(() => {
    if (!quiz) return [[], 0] as [number[], number]
    const base = quiz.questions.map((_, idx) => idx)
    if (quiz.isOrdered) return [base, 0]
    const s = session?.quizId === quiz.id && session.seed ? session.seed : Math.floor(Math.random() * 1e9)
    const shuffled = shuffle(base, s)
    return [shuffled, s]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.id])

  const total = quiz?.questions.length ?? 0
  const qIndex = questionOrder[currentIndex] ?? 0
  const q = quiz?.questions[qIndex]
  const selected = useQuizStore((s) => s.selectedOption)

  useEffect(() => {
    if (!quiz) return
    // initialize session on mount
    setState((prev) => ({
      ...prev,
      status: 'in_quiz',
      activeQuizId: quiz.id,
      session: {
        quizId: quiz.id,
        index: currentIndex,
        selected: prev.session?.selected ?? {},
        seed: seed || prev.session?.seed,
      },
    }))
  }, [quiz, seed, currentIndex, setState])

  const onSelect = (idx: 0 | 1 | 2 | 3) => {
    setState((prev) => ({ ...prev, selectedOption: idx, session: { ...(prev.session as any), selected: { ...(prev.session?.selected ?? {}), [currentIndex]: idx } } }))
  }

  const handleNext = () => {
    if (!quiz || selected === null) return
    const isCorrect = q && quiz.questions[qIndex].correctIndex === selected
    setState((prev) => ({
      ...prev,
      score: { numCorrect: prev.score.numCorrect + (isCorrect ? 1 : 0), answered: prev.score.answered + 1 },
      selectedOption: null,
      currentIndex: prev.currentIndex + 1,
      session: { ...(prev.session as any), index: prev.currentIndex + 1 },
    }))
  }

  const handleQuitOrFinish = (finished: boolean) => {
    if (!quiz) return
    const now = Date.now()
    setState((prev) => ({
      ...prev,
      attempts: [
        ...prev.attempts,
        {
          id: uuid(),
          timestamp: now,
          quizId: quiz.id,
          totalQuestions: total,
          answeredQuestions: prev.score.answered,
          numCorrect: prev.score.numCorrect,
          perfect: finished && prev.score.numCorrect === total,
          seed: seed || undefined,
        },
      ],
      status: 'show_results',
    }))
  }

  const onQuit = () => handleQuitOrFinish(false)
  const onFinishClick = () => handleQuitOrFinish(true)

  return (
    <Stack spacing={2}>
      <ProgressBar current={currentIndex} total={total} />
      {q && <QuestionCard question={q} selected={selected} onSelect={onSelect} />}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onQuit}>Quit</Button>
        {currentIndex + 1 < total ? (
          <Button variant="contained" disabled={selected === null} onClick={handleNext}>Next</Button>
        ) : (
          <Button variant="contained" disabled={selected === null} onClick={onFinishClick}>Finish</Button>
        )}
      </Stack>
    </Stack>
  )
}


