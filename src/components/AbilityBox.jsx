import { Box, Typography } from '@mui/material'
import { mod, signed } from '../parser.js'

const LABELS = { str: 'FUE', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR' }

export default function AbilityBox({ ability, score }) {
  const m = mod(score)
  return (
    <Box sx={{
      width: 62, py: 0.75, textAlign: 'center', borderRadius: 2,
      border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(0,0,0,0.25)',
    }}>
      <Typography sx={{ fontSize: 10, letterSpacing: 1, color: 'secondary.main' }}>
        {LABELS[ability]}
      </Typography>
      <Typography sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
        {score ?? '—'}
      </Typography>
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
        {m === null ? '' : signed(m)}
      </Typography>
    </Box>
  )
}
