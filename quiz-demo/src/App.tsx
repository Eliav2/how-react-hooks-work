import { Container, CssBaseline, AppBar, Toolbar, Typography, Box } from '@mui/material'
import { useEffect } from 'react'
import { useQuizStore } from './lib/store'
import { StartScreen } from './components/StartScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultsDialog } from './components/ResultsDialog'
import { quizzesById } from './quizzes'

function App() {
  const { status, activeQuizId, score } = useQuizStore()
  const setState = useQuizStore.setState

  useEffect(() => {
    // Auto-resume if session exists
    const { session } = useQuizStore.getState()
    if (session && session.quizId) {
      setState((prev) => ({ ...prev, status: 'in_quiz', activeQuizId: session.quizId, currentIndex: session.index, selectedOption: session.selected[session.index] ?? null }))
    }
  }, [setState])

  const handleStart = (quizId: keyof typeof quizzesById) => {
    setState((prev) => ({ ...prev, status: 'in_quiz', activeQuizId: quizId, currentIndex: 0, selectedOption: null, score: { numCorrect: 0, answered: 0 }, session: { quizId, index: 0, selected: {}, seed: undefined } }))
  }
  const handleResultsClose = () => {
    setState((prev) => ({ ...prev, status: 'idle', activeQuizId: null, currentIndex: 0, selectedOption: null, score: { numCorrect: 0, answered: 0 }, session: undefined }))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            React Hooks & Render Quiz
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ flex: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
        {status === 'idle' && <StartScreen onStart={handleStart} />}
        {status === 'in_quiz' && <QuizScreen onFinish={() => {}} />}
      </Container>
      <ResultsDialog open={status === 'show_results'} score={score} total={activeQuizId ? quizzesById[activeQuizId].questions.length : 0} onClose={handleResultsClose} />
    </Box>
  )
}

export default App
