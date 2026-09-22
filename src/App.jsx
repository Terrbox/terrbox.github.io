import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  AppBar, Toolbar, Typography, Button, Box, Container, TextField,
  Stack, Chip, Alert, InputAdornment, CircularProgress,
} from '@mui/material'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import InstallMobileIcon from '@mui/icons-material/InstallMobile'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import CharacterCard from './components/CharacterCard.jsx'
import ManualCharacterCard from './components/ManualCharacterCard.jsx'
import AddCharacterDialog from './components/AddCharacterDialog.jsx'
import { parseFile } from './parser.js'
import {
  fsApiSupported, pickDirectory, getSavedDirectory, ensurePermission, readXmlFiles,
} from './fs.js'
import {
  loadManualCharacters, saveManualCharacters, newManualCharacter, makeId,
} from './manualStore.js'

// Base key from the sync filename: the "(GM) " prefix removed, lowercased.
// GM "(GM) Nombre_5.xml" and player "Nombre_5.xml" share the same base, so they
// match by Name+ID rather than ID alone (IDs repeat across devices).
function baseFromName(name) {
  return String(name || '').replace(/^\(gm\)\s*/i, '').trim().toLowerCase()
}

// Stable identity for a character used as its drag-reorder key.
function keyOf(c) {
  return c.base || c.fileName || c.label || c.name || ''
}

// Per-campaign card order, persisted so it survives reconnects/reloads.
const ORDER_STORAGE_KEY = 'gmview.cardOrder'

function loadOrder() {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveOrder(order) {
  try { localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order)) } catch { /* ignore */ }
}

function moveItem(arr, from, to) {
  const copy = [...arr]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

// Builds the character list: GM files provide the stat block; the matching
// player file (same Name+ID base) provides the real prepared-spell list.
function assemble(files) {
  const gm = []
  const playerByBase = new Map()
  for (const f of files) {
    const r = parseFile(f.text)
    if (r.type === 'gm') {
      for (const c of r.characters) {
        gm.push({ ...c, folder: f.folder, fileName: f.fileName, base: baseFromName(f.fileName) })
      }
    } else if (r.type === 'player') {
      playerByBase.set(baseFromName(f.fileName), r.player)
    }
  }
  for (const c of gm) {
    if (c.base && playerByBase.has(c.base)) c.player = playerByBase.get(c.base)
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

  // silent: background refresh — no loader, no disruptive error messages, so the
  // scroll position and each card's UI state (open tab, collapsed campaign,
  // expanded traits) are preserved while the data updates in place.
  const loadFrom = useCallback(async (handle, { silent = false } = {}) => {
    if (!silent) { setLoading(true); setError('') }
    try {
      const files = await readXmlFiles(handle)
      const list = assemble(files)
      setChars(list)
      if (!silent && !list.length) setError('No se encontraron personajes (.xml) en la carpeta.')
    } catch (e) {
      if (!silent) setError('Error leyendo la carpeta: ' + (e?.message || e))
    } finally {
      if (!silent) setLoading(false)
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
        '(GM) Korgan_1.xml', 'Korgan_1.xml',
        '(GM) Lyra_2.xml', 'Lyra_2.xml',
        '(GM) Thera_3.xml', 'Thera_3.xml',
        '(GM) Pip_4.xml', 'Pip_4.xml',
        '(GM) Groll_5.xml', 'Groll_5.xml',
      ]
      const files = []
      for (const fileName of names) {
        const res = await fetch(base + 'samples/' + encodeURIComponent(fileName))
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

  // Auto-refresh every 30 s in the background (only with a connected folder,
  // paused while the tab is hidden). Silent so it never shows the loader.
  useEffect(() => {
    if (!dirHandle || needsReconnect) return undefined
    const id = setInterval(() => {
      if (document.hidden) return
      loadFrom(dirHandle, { silent: true })
    }, 30000)
    return () => clearInterval(id)
  }, [dirHandle, needsReconnect, loadFrom])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return chars
    return chars.filter((c) =>
      (c.name || '').toLowerCase().includes(term) ||
      (c.label || '').toLowerCase().includes(term) ||
      (c.folder || '').toLowerCase().includes(term))
  }, [chars, q])

  // Characters created by hand in the viewer (not parsed from synced files),
  // persisted in localStorage so they survive reloads.
  const [manualChars, setManualChars] = useState(loadManualCharacters)
  const [addOpen, setAddOpen] = useState(false)

  const persistManual = (list) => { setManualChars(list); saveManualCharacters(list) }

  const addManualCharacter = ({ kind, name, ac, hp }) => {
    persistManual([...manualChars, newManualCharacter({ kind, name, ac, hp })])
  }
  const updateManualCharacter = (id, patch) => {
    persistManual(manualChars.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }
  const updateManualInstance = (id, instanceId, patch) => {
    persistManual(manualChars.map((m) => (m.id !== id ? m : {
      ...m, instances: m.instances.map((inst) => (inst.id === instanceId ? { ...inst, ...patch } : inst)),
    })))
  }
  const addManualInstance = (id) => {
    persistManual(manualChars.map((m) => {
      if (m.id !== id) return m
      const last = m.instances[m.instances.length - 1]
      return { ...m, instances: [...m.instances, { id: makeId(), ac: last?.ac || '', hp: '' }] }
    }))
  }
  const removeManualInstance = (id, instanceId) => {
    persistManual(manualChars.map((m) => (m.id !== id || m.instances.length <= 1 ? m : {
      ...m, instances: m.instances.filter((inst) => inst.id !== instanceId),
    })))
  }
  const deleteManualCharacter = (id) => {
    persistManual(manualChars.filter((m) => m.id !== id))
  }

  const filteredManual = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return manualChars
    return manualChars.filter((m) => (m.name || '').toLowerCase().includes(term))
  }, [manualChars, q])

  // Manual card order per campaign (drag & drop), persisted in localStorage.
  const [order, setOrder] = useState(loadOrder)
  // Currently dragged card ({ folder, key }) and the key it's hovering over.
  const [dragState, setDragState] = useState(null)
  const [overKey, setOverKey] = useState(null)

  const groups = useMemo(() => {
    const g = new Map()
    for (const c of filtered) {
      const k = c.folder || 'Sin campaña'
      if (!g.has(k)) g.set(k, [])
      g.get(k).push(c)
    }
    const entries = Array.from(g.entries())
    for (const [folder, items] of entries) {
      const saved = order[folder]
      if (!saved || !saved.length) continue
      const idx = new Map(saved.map((k, i) => [k, i]))
      items.sort((a, b) => {
        const ia = idx.has(keyOf(a)) ? idx.get(keyOf(a)) : Infinity
        const ib = idx.has(keyOf(b)) ? idx.get(keyOf(b)) : Infinity
        return ia - ib
      })
    }
    return entries
  }, [filtered, order])

  const handleDragStart = (folder, key) => (e) => {
    setDragState({ folder, key })
    e.dataTransfer.effectAllowed = 'move'
    try { e.dataTransfer.setData('text/plain', key) } catch { /* ignore */ }
  }

  const handleDragEnd = () => {
    setDragState(null)
    setOverKey(null)
  }

  const handleDragOverCard = (folder, key) => (e) => {
    if (!dragState || dragState.folder !== folder || dragState.key === key) return
    e.preventDefault()
    setOverKey(key)
  }

  const handleDropCard = (folder, key) => (e) => {
    if (!dragState || dragState.folder !== folder || dragState.key === key) return
    e.preventDefault()
    const group = groups.find(([f]) => f === folder)
    if (group) {
      const keys = group[1].map(keyOf)
      const from = keys.indexOf(dragState.key)
      const to = keys.indexOf(key)
      if (from !== -1 && to !== -1) {
        const nextKeys = moveItem(keys, from, to)
        setOrder((prev) => {
          const next = { ...prev, [folder]: nextKeys }
          saveOrder(next)
          return next
        })
      }
    }
    setDragState(null)
    setOverKey(null)
  }

  const [dragOver, setDragOver] = useState(false)
  // Per-campaign collapse of the card details (languages + tabs). Default expanded.
  const [collapsed, setCollapsed] = useState({})
  // PWA install prompt. Installing keeps the folder permission across sessions.
  const [installEvt, setInstallEvt] = useState(null)

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setInstallEvt(e) }
    const onInstalled = () => setInstallEvt(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async () => {
    if (!installEvt) return
    installEvt.prompt()
    try { await installEvt.userChoice } finally { setInstallEvt(null) }
  }

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
          <Button variant="outlined" color="secondary" startIcon={<PersonAddAlt1Icon />} onClick={() => setAddOpen(true)}>
            Añadir personaje
          </Button>
          {installEvt && (
            <Button variant="outlined" color="secondary" startIcon={<InstallMobileIcon />} onClick={install}>
              Instalar
            </Button>
          )}
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

      <Container maxWidth={false} sx={{ py: 3 }}>
        {needsReconnect && (
          <Alert severity="info" sx={{ mb: 2 }} action={
            <Button color="inherit" size="small" onClick={reconnect}>Reconectar</Button>
          }>
            Carpeta guardada: «{dirHandle?.name}». Concede permiso de lectura para cargarla.
          </Alert>
        )}
        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

        {filteredManual.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Typography variant="h5" sx={{ color: 'secondary.main' }}>Personajes manuales</Typography>
              <Chip size="small" label={`${filteredManual.length} personaje${filteredManual.length === 1 ? '' : 's'}`} />
            </Stack>
            <Box sx={{
              display: 'grid', gap: 2, alignItems: 'stretch',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
              },
            }}>
              {filteredManual.map((m) => (
                <ManualCharacterCard key={m.id} m={m}
                                      onUpdate={(patch) => updateManualCharacter(m.id, patch)}
                                      onUpdateInstance={(instanceId, patch) => updateManualInstance(m.id, instanceId, patch)}
                                      onAddInstance={() => addManualInstance(m.id)}
                                      onRemoveInstance={(instanceId) => removeManualInstance(m.id, instanceId)}
                                      onDelete={() => deleteManualCharacter(m.id)} />
              ))}
            </Box>
          </Box>
        )}

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
              <Button size="small" variant="outlined" color="secondary"
                      startIcon={collapsed[folder] ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
                      onClick={() => setCollapsed((prev) => ({ ...prev, [folder]: !prev[folder] }))}>
                {collapsed[folder] ? 'Expandir' : 'Colapsar'}
              </Button>
            </Stack>
            <Box sx={{
              display: 'grid', gap: 2, alignItems: 'stretch',
              // Fixed column count: 1 on phones, 2 on small tablets, 3 from
              // desktop up (staying 3 on big screens → wider cards, never a row
              // of many narrow ones). The card content is sized to fit 3 columns.
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
              },
            }}>
              {items.map((c, i) => {
                const key = keyOf(c) || String(i)
                return (
                  <CharacterCard key={`${folder}|${key}`}
                                 c={c} detailsOpen={!collapsed[folder]}
                                 dragging={dragState?.folder === folder && dragState.key === key}
                                 dragOverActive={!!dragState && dragState.folder === folder &&
                                   dragState.key !== key && overKey === key}
                                 onNameDragStart={handleDragStart(folder, key)}
                                 onNameDragEnd={handleDragEnd}
                                 onCardDragOver={handleDragOverCard(folder, key)}
                                 onCardDrop={handleDropCard(folder, key)} />
                )
              })}
            </Box>
          </Box>
        ))}
      </Container>

      <AddCharacterDialog open={addOpen} onClose={() => setAddOpen(false)} onCreate={addManualCharacter} />
    </Box>
  )
}
