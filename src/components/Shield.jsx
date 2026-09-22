import { Box, Typography } from '@mui/material'

// AC rendered inside a heraldic shield. `compact` (used in the collapsed card)
// shrinks it and drops the "CA" label and the armour source line.
export default function Shield({ value, source, compact = false }) {
  const w = compact ? 52 : 84
  const h = compact ? 57 : 92
  return (
    <Box sx={{ position: 'relative', width: w, textAlign: 'center' }}>
      <Box sx={{ position: 'relative', width: w, height: h, mx: 'auto' }}>
        <svg viewBox="0 0 100 110" width={w} height={h} aria-hidden>
          <defs>
            <linearGradient id="shieldg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a2f22" />
              <stop offset="100%" stopColor="#1b1611" />
            </linearGradient>
          </defs>
          <path
            d="M50 4 L92 18 V52 C92 82 72 100 50 106 C28 100 8 82 8 52 V18 Z"
            fill="url(#shieldg)" stroke="#d4af37" strokeWidth="3"
          />
        </svg>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                   alignItems: 'center', justifyContent: 'center', pt: compact ? 0 : 0.5 }}>
          <Typography sx={{ fontSize: compact ? 20 : 30, fontWeight: 800, lineHeight: 1, color: '#efe6d4' }}>
            {value ?? '—'}
          </Typography>
          {compact ? null : (
            <Typography sx={{ fontSize: 9, letterSpacing: 1.5, color: '#d4af37', textTransform: 'uppercase' }}>
              CA
            </Typography>
          )}
        </Box>
      </Box>
      {!compact && source ? (
        <Typography sx={{ fontSize: 10, color: 'text.secondary', mt: 0.25, lineHeight: 1.1 }}>
          {source}
        </Typography>
      ) : null}
    </Box>
  )
}
