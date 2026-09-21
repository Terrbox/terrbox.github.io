import { createTheme } from '@mui/material/styles'

// Dark "grimoire" theme: parchment text, blood-red accents, gold highlights.
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#14100c', paper: '#211b15' },
    primary: { main: '#c1272d' },   // blood red
    secondary: { main: '#d4af37' },  // gold
    text: { primary: '#efe6d4', secondary: '#b8a888' },
    divider: 'rgba(212,175,55,0.25)',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Georgia", "Iowan Old Style", "Times New Roman", serif',
    h4: { fontWeight: 700, letterSpacing: 0.5 },
    h6: { fontWeight: 700 },
    overline: { letterSpacing: 2, color: '#b8a888' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(212,175,55,0.22)',
        },
      },
    },
  },
})

export default theme
