import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

export function ResultsDialog({
  open,
  score,
  total,
  onClose,
}: {
  open: boolean
  score: { numCorrect: number; answered: number }
  total: number
  onClose: () => void
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Results</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Correct: {score.numCorrect} / {score.answered === total ? total : `${score.answered}/${total}`}</Typography>
        <Typography variant="caption" color="text.secondary">We do not reveal which questions were wrong, by design.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  )
}


