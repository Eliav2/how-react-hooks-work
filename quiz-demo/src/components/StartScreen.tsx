import { Button, Card, CardActions, CardContent, Stack, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { quizzesById } from '../quizzes'
import { useQuizStore } from '../lib/store'
import type { Quiz } from '../types/models'

function isUnlocked(quiz: Quiz, hasPerfectMap: Record<string, boolean>): boolean {
  if (!quiz.dependsOn || quiz.dependsOn.length === 0) return true
  return quiz.dependsOn.every((d) => (d.mustBePerfect ? !!hasPerfectMap[d.quizId] : hasPerfectMap[d.quizId] !== undefined))
}

export function StartScreen({ onStart }: { onStart: (quizId: keyof typeof quizzesById) => void }) {
  const attempts = useQuizStore((s) => s.attempts)

  const hasPerfectMap: Record<string, boolean> = attempts.reduce((acc, a) => {
    if (a.perfect) acc[a.quizId] = true
    return acc
  }, {} as Record<string, boolean>)

  const history = attempts
    .slice()
    .reverse()
    .map((a) => ({
      id: a.id,
      when: new Date(a.timestamp),
      label: `${a.quizId} • ${a.numCorrect}/${a.totalQuestions}`,
    }))

  const items = Object.values(quizzesById)

  return (
    <Stack spacing={3}>
      {Object.keys(hasPerfectMap).length > 0 && (
        <Typography color="success.main" variant="subtitle1">Perfect attempt achieved! 🎉</Typography>
      )}
      <Grid container spacing={3}>
        {items.map((q) => {
          const unlocked = isUnlocked(q, hasPerfectMap)
          const button = (
            <Button variant="contained" onClick={() => onStart(q.id)} disabled={!unlocked} fullWidth size="large">
              Start {q.title}
            </Button>
          )
          return (
            <Grid size="grow" key={q.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h5" gutterBottom>{q.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{q.description}</Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  {unlocked ? (
                    button
                  ) : (
                    <Tooltip title="Finish Code with 100% to unlock Concepts">
                      <span style={{ width: '100%' }}>{button}</span>
                    </Tooltip>
                  )}
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
      <Stack>
        <Typography variant="subtitle1">History</Typography>
        {history.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No attempts yet.</Typography>
        ) : (
          history.map((h) => (
            <Typography key={h.id} variant="body2">{`${h.label} • ${h.when.toLocaleString()}`}</Typography>
          ))
        )}
      </Stack>
    </Stack>
  )
}


