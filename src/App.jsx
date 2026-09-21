import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Grid, TextField,
  Stack, Chip, Alert, InputAdornment, CircularProgress,
} from '@mui/material'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import CharacterCard from './components/CharacterCard.jsx'
import { parseFile } from './parser.js'
import {
  fsApiSupported, pickDirectory, getSavedDirectory, ensurePermission, readXmlFiles,
} from './fs.js'

// Base key from the sync filename: the "(GM) " prefix removed, lowercased.
// GM "(GM) Nombre_5.xml" and player "Nombre_5.xml" share the same base, so they
// match by Name+ID rather than ID alone (IDs repeat across devices).
function baseFromName(name) {
  return String(name || '').replace(/^\(gm\)\s*/i, '').trim().toLowerCase()
}

// Builds the character list: GM files provide the stat block; the matching
// player file (same Name+ID base) provides the real prepared-spell list.
function assemble(files) {
  const gm = []
  const spellsByBase = new Map()
  for (const f of files) {
    const r = parseFile(f.text)
    if (r.type === 'gm') {
      for (const c of r.characters) {
        gm.push({ ...c, folder: f.folder, fileName: f.fileName, base: baseFromName(f.fileName) })
      }
    } else if (r.type === 'player') {
      spellsByBase.set(baseFromName(f.fileName), r.spells)
    }
  }
  for (const c of gm) {
    if (c.base && spellsByBase.has(c.base)) c.preparedSpells = spellsByBase.get(c.base)
  }
  gm.sort((a, b) => (a.label || a.name || '').localeCompare(b.label || b.name || ''))
  return gm
}

export default function App() {
  const [dirHandle, setDirHandle] = useState(null)
  const [chars, setChars] = useState([])
  const [needsReconnect, setNeedsReconnect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  const loadFrom = useCallback(async (handle) => {
    setLoading(true); setError('')
    try {
      const files = await readXmlFiles(handle)
      const list = assemble(files)
      setChars(list)
      if (!list.length) setError('No se encontraron personajes (.xml) en la carpeta.')
    } catch (e) {
      setError('Error leyendo la carpeta: ' + (e?.message || e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    (async () => {
      if (!fsApiSupported) return
      const saved = await getSavedDirectory()
      if (!saved) return
      setDirHandle(saved)
      const ok = (await saved.queryPermission?.({ mode: 'read' })) === 'granted'
      if (ok) loadFrom(saved)
      else setNeedsReconnect(true)
    })()
  }, [loadFrom])

  const openFolder = async () => {
    try {
      const h = await pickDirectory()
      setDirHandle(h); setNeedsReconnect(false)
      loadFrom(h)
    } catch { /* user cancelled */ }
  }

  const reconnect = async () => {
    if (!dirHandle) return
    if (await ensurePermission(dirHandle)) { setNeedsReconnect(false); loadFrom(dirHandle) }
  }

  const reload = () => { if (dirHandle) loadFrom(dirHandle) }

  // Fallback: file input / drag-drop for browsers without the FS Access API.
  const loadFiles = async (fileList) => {
    setLoading(true); setError('')
    try {
      const files = []
      for (const file of Array.from(fileList)) {
        if (!file.name.toLowerCase().endsWith('.xml')) continue
        files.push({ fileName: file.name, folder: 'Importados', text: await file.text() })
      }
      const list = assemble(files)
      setChars(list)
      if (!list.length) setError('No se encontraron personajes en los archivos.')
    } finally { setLoading(false) }
  }

  const loadDemo = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const base = import.meta.env.BASE_URL
      const names = [
        ['samples/Thalindra_1.xml', 'Thalindra Miraluz_1.xml'],
        ['samples/(GM) Thalindra_1.xml', '(GM) Thalindra Miraluz_1.xml'],
        ['samples/(GM) Korgan_2.xml', '(GM) Korgan Piedrahierro_2.xml'],
      ]
      const files = []
      for (const [path, fileName] of names) {
        const res = await fetch(base + path)
        if (res.ok) files.push({ fileName, folder: 'Campaña de ejemplo', text: await res.text() })
      }
      setChars(assemble(files))
    } catch (e) {
      setError('No se pudo cargar la demo: ' + (e?.message || e))
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('demo') === '1') loadDemo()
  }, [loadDemo])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return chars
    return chars.filter((c) =>
      (c.name || '').toLowerCase().includes(term) ||
      (c.label || '').toLowerCase().includes(term) ||
      (c.folder || '').toLowerCase().includes(term))
  }, [chars, q])

  const groups = useMemo(() => {
    const g = new Map()
    for (const c of filtered) {
      const k = c.folder || 'Sin campaña'
      if (!g.has(k)) g.set(k, [])
      g.get(k).push(c)
    }
    return Array.from(g.entries())
  }, [filtered])

  const [dragOver, setDragOver] = useState(false)

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="sticky" color="transparent"
              sx={{ backdropFilter: 'blur(6px)', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ color: 'secondary.main', flexShrink: 0 }}>
            ⚔️ GM Viewer
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <TextField
            size="small" placeholder="Buscar personaje / campaña…"
            value={q} onChange={(e) => setQ(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
            sx={{ minWidth: 220 }}
          />
          {fsApiSupported && (
            <Button variant="contained" startIcon={<FolderOpenIcon />} onClick={openFolder}>
              Abrir carpeta
            </Button>
          )}
          {dirHandle && (
            <Button variant="outlined" color="secondary" startIcon={<RefreshIcon />} onClick={reload}>
              Recargar
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {needsReconnect && (
          <Alert severity="info" sx={{ mb: 2 }} action={
            <Button color="inherit" size="small" onClick={reconnect}>Reconectar</Button>
          }>
            Carpeta guardada: «{dirHandle?.name}». Concede permiso de lectura para cargarla.
          </Alert>
        )}
        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

        {loading && (
          <Stack alignItems="center" sx={{ py: 6 }}><CircularProgress color="secondary" /></Stack>
        )}

        {!loading && chars.length === 0 && (
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); loadFiles(e.dataTransfer.files) }}
            sx={{
              mt: 4, p: 6, textAlign: 'center', borderRadius: 3,
              border: '2px dashed', borderColor: dragOver ? 'secondary.main' : 'divider',
              background: dragOver ? 'rgba(212,175,55,0.06)' : 'transparent',
            }}
          >
            <Typography variant="h4" sx={{ color: 'secondary.main', mb: 1 }}>Fichas de tus jugadores</Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3 }}>
              {fsApiSupported
                ? 'Pulsa «Abrir carpeta» y elige tu carpeta de Google Drive para escritorio (la que sincroniza el GM Sync). Verás una ficha por personaje, agrupadas por campaña.'
                : 'Tu navegador no soporta abrir carpetas. Arrastra aquí los archivos (GM) *.xml o selecciónalos.'}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              {fsApiSupported && (
                <Button variant="contained" size="large" startIcon={<FolderOpenIcon />} onClick={openFolder}>
                  Abrir carpeta
                </Button>
              )}
              <Button variant="outlined" component="label" size="large">
                Seleccionar archivos
                <input hidden type="file" accept=".xml" multiple
                       onChange={(e) => loadFiles(e.target.files)} />
              </Button>
              <Button variant="text" color="secondary" size="large" onClick={loadDemo}>
                Ver demo
              </Button>
            </Stack>
          </Box>
        )}

        {!loading && chars.length > 0 && groups.map(([folder, items]) => (
          <Box key={folder} sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Typography variant="h5" sx={{ color: 'secondary.main' }}>{folder}</Typography>
              <Chip size="small" label={`${items.length} personaje${items.length === 1 ? '' : 's'}`} />
            </Stack>
            <Grid container spacing={2}>
              {items.map((c, i) => (
                <Grid item xs={12} md={6} lg={4} xl={3} key={folder + i}>
                  <CharacterCard c={c} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Container>
    </Box>
  )
}
