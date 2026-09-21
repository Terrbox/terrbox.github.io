import { Box, Typography } from '@mui/material'

// AC rendered inside a heraldic shield.
export default function Shield({ value, source }) {
  return (
    <Box sx={{ position: 'relative', width: 84, textAlign: 'center' }}>
      <Box sx={{ position: 'relative', width: 84, height: 92, mx: 'auto' }}>
        <svg viewBox="0 0 100 110" width="84" height="92" aria-hidden>
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
                   alignItems: 'center', justifyContent: 'center', pt: 0.5 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: '#efe6d4' }}>
            {value ?? '—'}
          </Typography>
          <Typography sx={{ fontSize: 9, letterSpacing: 1.5, color: '#d4af37', textTransform: 'uppercase' }}>
            CA
          </Typography>
        </Box>
      </Box>
      {source ? (
        <Typography sx={{ fontSize: 10, color: 'text.secondary', mt: 0.25, lineHeight: 1.1 }}>
          {source}
        </Typography>
      ) : null}
    </Box>
  )
}
