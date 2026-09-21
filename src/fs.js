// Local folder access via the File System Access API (Chromium browsers).
// The chosen directory handle is persisted in IndexedDB so it survives reloads.

const DB = 'gmviewer'
const STORE = 'handles'
const KEY = 'dir'

export const fsApiSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window

function idb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbSet(key, val) {
  const db = await idb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(val, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function idbGet(key) {
  const db = await idb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const r = tx.objectStore(STORE).get(key)
    r.onsuccess = () => resolve(r.result || null)
    r.onerror = () => reject(r.error)
  })
}

export async function pickDirectory() {
  const handle = await window.showDirectoryPicker({ mode: 'read' })
  await idbSet(KEY, handle)
  return handle
}

export async function getSavedDirectory() {
  try { return await idbGet(KEY) } catch { return null }
}

export async function ensurePermission(handle) {
  if (!handle.queryPermission) return true
  const opts = { mode: 'read' }
  if ((await handle.queryPermission(opts)) === 'granted') return true
  return (await handle.requestPermission(opts)) === 'granted'
}

// Recursively collect *.xml files (top folder + one level of subfolders, which
// is how the GM sync lays out one subfolder per campaign).
export async function readXmlFiles(handle, depth = 1) {
  const out = []
  for await (const [name, entry] of handle.entries()) {
    if (entry.kind === 'file' && name.toLowerCase().endsWith('.xml')) {
      try {
        const file = await entry.getFile()
        out.push({ fileName: name, folder: handle.name, text: await file.text() })
      } catch { /* skip unreadable */ }
    } else if (entry.kind === 'directory' && depth > 0) {
      const sub = await readXmlFiles(entry, depth - 1)
      out.push(...sub)
    }
  }
  return out
}
