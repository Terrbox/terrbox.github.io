import { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, MenuItem, Button, Autocomplete,
} from '@mui/material'

const KIND_OPTIONS = [
  { value: 'pj', label: 'PJ' },
  { value: 'npc', label: 'NPC' },
  { value: 'enemy', label: 'Enemigo' },
]

// Only Tipo + Nombre are required; CA/PV/Campaña are optional and editable later.
// Defaults: "Enemigo" (the most common thing a GM adds mid-session) and the
// first known campaign (so it lands somewhere sensible without extra clicks).
export default function AddCharacterDialog({ open, onClose, onCreate, folderOptions = [] }) {
  const [kind, setKind] = useState('enemy')
  const [name, setName] = useState('')
  const [ac, setAc] = useState('')
  const [hp, setHp] = useState('')
  const [folder, setFolder] = useState('')

  useEffect(() => {
    if (open) { setKind('enemy'); setFolder(folderOptions[0] || '') }
  }, [open, folderOptions])

  const reset = () => { setName(''); setAc(''); setHp('') }
  const close = () => { onClose(); reset() }

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onCreate({ kind, name: trimmed, ac: ac.trim(), hp: hp.trim(), folder: folder.trim() })
    close()
  }

  return (
    <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
      <DialogTitle>Añadir personaje</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField select label="Tipo" value={kind} onChange={(e) => setKind(e.target.value)} required>
            {KIND_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
          <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)}
                     required autoFocus
                     onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) submit() }} />
          <Stack direction="row" spacing={2}>
            <TextField label="CA" value={ac} onChange={(e) => setAc(e.target.value)} fullWidth />
            <TextField label="PV" value={hp} onChange={(e) => setHp(e.target.value)} fullWidth />
          </Stack>
          {folderOptions.length !== 1 && (
            <Autocomplete
              freeSolo options={folderOptions} value={folder}
              onInputChange={(e, v) => setFolder(v)}
              renderInput={(params) => (
                <TextField {...params} label="Campaña" placeholder="Sin campaña" />
              )}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button variant="contained" onClick={submit} disabled={!name.trim()}>Crear</Button>
      </DialogActions>
    </Dialog>
  )
}
