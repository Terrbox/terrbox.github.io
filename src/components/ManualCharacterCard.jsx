import { useEffect, useState } from 'react'
import {
  Card, CardContent, Box, Typography, Chip, Stack, TextField, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const KIND_LABELS = { pj: 'PJ', npc: 'NPC', enemy: 'Enemigo' }
const KIND_COLORS = { pj: 'primary', npc: 'secondary', enemy: 'error' }

// Click-to-edit text: shows a Typography, swaps to a TextField on click and
// commits on blur/Enter (Escape reverts without saving).
function InlineEditable({ value, onCommit, placeholder = '—', inputProps, sx, onEditingChange }) {
  const [editing, setEditingState] = useState(false)
  const setEditing = (v) => { setEditingState(v); onEditingChange?.(v) }
  const [draft, setDraft] = useState(value ?? '')
  useEffect(() => { if (!editing) setDraft(value ?? '') }, [value, editing])

  const commit = () => {
    setEditing(false)
    const v = draft.trim()
    if (v !== (value ?? '')) onCommit(v)
  }

  if (editing) {
    return (
      <TextField
        autoFocus size="small" variant="standard" value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); commit() }
          if (e.key === 'Escape') { setDraft(value ?? ''); setEditing(false) }
        }}
        sx={{ minWidth: 48, ...sx }}
        {...inputProps}
      />
    )
  }
  return (
    <Typography
      onClick={() => setEditing(true)}
      sx={{ cursor: 'pointer', borderBottom: '1px dashed transparent', '&:hover': { borderColor: 'divider' }, ...sx }}
    >
      {value ? value : <Box component="span" sx={{ color: 'text.secondary' }}>{placeholder}</Box>}
    </Typography>
  )
}

// Free-text notes box, saved on blur so every keystroke doesn't hit storage.
function NotesField({ value, onCommit }) {
  const [draft, setDraft] = useState(value || '')
  useEffect(() => { setDraft(value || '') }, [value])
  return (
    <TextField
      value={draft} onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { if (draft !== (value || '')) onCommit(draft) }}
      placeholder="Más datos…" multiline minRows={2} fullWidth size="small" variant="outlined"
      sx={{ mt: 2 }}
    />
  )
}

function StatEdit({ label, value, onCommit }) {
  return (
    <Stack alignItems="center" spacing={0.25}>
      <Typography sx={{ fontSize: 10, letterSpacing: 1, color: 'secondary.main' }}>{label}</Typography>
      <InlineEditable value={value} onCommit={onCommit}
                       sx={{ fontSize: 18, fontWeight: 700, textAlign: 'center' }}
                       inputProps={{ sx: { width: 60, '& input': { textAlign: 'center' } } }} />
    </Stack>
  )
}

export default function ManualCharacterCard({
  m, onUpdate, onUpdateInstance, onAddInstance, onRemoveInstance, onDelete,
  dragging = false, dragOverActive = false,
  onNameDragStart, onNameDragEnd, onCardDragOver, onCardDrop,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [nameEditing, setNameEditing] = useState(false)
  const isEnemy = m.kind === 'enemy'

  return (
    <Card elevation={6}
          onDragOver={onCardDragOver}
          onDrop={onCardDrop}
          sx={{
            position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
            transition: 'opacity .15s',
            opacity: dragging ? 0.4 : 1,
            ...(dragOverActive
              ? { outline: '2px dashed', outlineColor: 'secondary.main', outlineOffset: '-2px' }
              : {}),
          }}>
      <IconButton size="small" onClick={() => setConfirmOpen(true)} aria-label="Eliminar personaje"
                  sx={{
                    position: 'absolute', top: 6, right: 6, zIndex: 1, color: '#ff6b6b',
                    bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(224,83,83,0.25)' },
                  }}>
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box draggable={!!onNameDragStart && !nameEditing}
           onDragStart={onNameDragStart}
           onDragEnd={onNameDragEnd}
           sx={{
             px: 2, py: 1.5, pr: 5, borderBottom: '2px solid', borderColor: 'primary.main',
             background: 'linear-gradient(180deg, rgba(193,39,45,0.18), rgba(0,0,0,0))',
             ...(onNameDragStart ? { cursor: 'grab', '&:active': { cursor: 'grabbing' } } : {}),
           }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip size="small" label={KIND_LABELS[m.kind] || m.kind} color={KIND_COLORS[m.kind]} sx={{ fontWeight: 700 }} />
          <InlineEditable value={m.name} placeholder="Nombre" onEditingChange={setNameEditing}
                           onCommit={(v) => { if (v) onUpdate({ name: v }) }}
                           sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.15, flexGrow: 1 }} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Campaña:</Typography>
          <InlineEditable value={m.folder} placeholder="Sin campaña"
                           onCommit={(v) => onUpdate({ folder: v })}
                           sx={{ fontSize: 12, color: 'text.secondary' }} />
        </Stack>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        {isEnemy ? (
          <Stack spacing={1}>
            {m.instances.map((inst, i) => (
              <Stack key={inst.id} direction="row" alignItems="center" spacing={2}
                     sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', minWidth: 18 }}>#{i + 1}</Typography>
                <StatEdit label="CA" value={inst.ac} onCommit={(v) => onUpdateInstance(inst.id, { ac: v })} />
                <StatEdit label="PV" value={inst.hp} onCommit={(v) => onUpdateInstance(inst.id, { hp: v })} />
                {m.instances.length > 1 && (
                  <IconButton size="small" onClick={() => onRemoveInstance(inst.id)}
                              aria-label="Eliminar este enemigo" sx={{ ml: 'auto' }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={onAddInstance} sx={{ alignSelf: 'flex-start' }}>
              Añadir enemigo
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={4}>
            <StatEdit label="CA" value={m.instances[0]?.ac}
                      onCommit={(v) => onUpdateInstance(m.instances[0].id, { ac: v })} />
            <StatEdit label="PV" value={m.instances[0]?.hp}
                      onCommit={(v) => onUpdateInstance(m.instances[0].id, { hp: v })} />
          </Stack>
        )}

        <NotesField value={m.notes} onCommit={(v) => onUpdate({ notes: v })} />
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar personaje</DialogTitle>
        <DialogContent>
          <Typography>¿Seguro que quieres eliminar «{m.name || '(sin nombre)'}»? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={() => { setConfirmOpen(false); onDelete() }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
