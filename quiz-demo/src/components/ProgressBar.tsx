import { LinearProgress, Stack, Typography } from '@mui/material'

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0
  const left = Math.max(total - (current + 1), 0)
  return (
    <Stack spacing={1} aria-label={`Progress: question ${current + 1} of ${total}`}>
      <LinearProgress variant="determinate" value={pct} />
      <Typography variant="caption">Q {current + 1} of {total} • Left: {left}</Typography>
    </Stack>
  )
}


