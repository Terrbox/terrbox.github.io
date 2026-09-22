// Persistence for characters created by hand in the viewer (not parsed from
// synced files). Stored in localStorage so they survive reloads/reconnects.
const STORAGE_KEY = 'gmview.manualCharacters'

let uidCounter = 0
export function makeId() {
  uidCounter += 1
  return `m${Date.now().toString(36)}${uidCounter}${Math.random().toString(36).slice(2, 7)}`
}

export function loadManualCharacters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch { return [] }
}

export function saveManualCharacters(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

// `kind`: 'pj' | 'npc' | 'enemy'. Only 'enemy' cards support several
// instances (each with its own CA/PV); pj/npc always keep a single one.
// `folder` groups the card alongside synced characters from that campaign
// (falls back to "Sin campaña", same as characters with no synced folder).
export function newManualCharacter({ kind, name, ac, hp, folder = '' }) {
  return {
    id: makeId(),
    kind,
    name,
    folder,
    notes: '',
    instances: [{ id: makeId(), ac: ac || '', hp: hp || '' }],
  }
}
