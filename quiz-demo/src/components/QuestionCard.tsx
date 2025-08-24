import { Card, CardContent, Stack, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import okaidia from 'react-syntax-highlighter/dist/esm/styles/prism/okaidia'
import type { Question } from '../types/models'

SyntaxHighlighter.registerLanguage('tsx', tsx)

export function QuestionCard({
  question,
  selected,
  onSelect,
}: {
  question: Question
  selected: 0 | 1 | 2 | 3 | null
  onSelect: (idx: 0 | 1 | 2 | 3) => void
}) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {question.code?.content && (
            <SyntaxHighlighter language="tsx" style={okaidia} wrapLongLines>
              {question.code.content}
            </SyntaxHighlighter>
          )}
          <Typography variant="body1">{question.promptText}</Typography>
          <RadioGroup value={selected ?? -1} onChange={(_, v) => onSelect(Number(v) as 0 | 1 | 2 | 3)}>
            {question.options.map((opt, i) => (
              <FormControlLabel key={i} value={i} control={<Radio />} label={opt} />)
            )}
          </RadioGroup>
        </Stack>
      </CardContent>
    </Card>
  )
}


