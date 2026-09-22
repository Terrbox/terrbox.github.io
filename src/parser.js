// Parses the Game Master 5e character XML (produced by Fight Club's "Game Master
// File" export). Root: <characters version="5"> with one or more <pc>/<npc>.

const SCALAR = new Set([
  'label', 'name', 'level', 'size', 'ac', 'hp', 'speed', 'init',
  'str', 'dex', 'con', 'int', 'wis', 'cha', 'passive',
])
const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const BLOCK_TYPES = new Set(['action', 'trait', 'reaction', 'legendary'])

function text(el) {
  return (el.textContent || '').trim()
}

function mod(score) {
  const n = parseInt(score, 10)
  if (Number.isNaN(n)) return null
  return Math.floor((n - 10) / 2)
}

function signed(n) {
  if (n === null || n === undefined || n === '') return ''
  const num = typeof n === 'number' ? n : parseInt(n, 10)
  if (Number.isNaN(num)) return String(n)
  return (num >= 0 ? '+' : '') + num
}

function parseAc(raw) {
  if (!raw) return { value: null, source: '' }
  const m = raw.match(/^\s*(\d+)\s*(?:\(([^)]*)\))?/)
  if (!m) return { value: raw, source: '' }
  return { value: m[1], source: (m[2] || '').trim() }
}

function parseHp(raw) {
  if (!raw) return { current: null, max: null, formula: '' }
  const m = raw.match(/^\s*(\d+)\s*\/\s*(\d+)\s*(?:\(([^)]*)\))?/)
  if (m) return { current: m[1], max: m[2], formula: (m[3] || '').trim() }
  const single = raw.match(/^\s*(\d+)/)
  return { current: single ? single[1] : null, max: single ? single[1] : null, formula: '' }
}

// "<slots>2,3,2</slots>" -> [{level:1,count:2},{level:2,count:3},{level:3,count:2}]
// (index 0 in the list is spell level 1). Only levels with at least one slot.
function parseSlots(raw) {
  if (!raw) return []
  return raw.split(',').map((s, i) => ({ level: i + 1, count: parseInt(s.trim(), 10) || 0 }))
    .filter((x) => x.count > 0)
}

// "2,3,0," -> [2,3,0] (trailing/empty entries dropped to 0). null if no input.
function parseCsvInts(raw) {
  if (!raw) return null
  return raw.split(',').map((s) => parseInt(s.trim(), 10) || 0)
}

// The player file's live slot arrays (<slots>/<slotsCurrent> under <character>)
// are [cantrips, level1, level2, …] — index 0 is the cantrip count, so spell
// level L lives at index L. Builds [{level, count, current}] for levels 1-9 with
// at least one slot. `current` falls back to the max when there is no current
// array. Used as a fallback when there is no GM file (the GM export's <slots>
// is the authoritative total otherwise, but without a current count).
function slotsFromArrays(totals, currents) {
  if (!totals) return []
  const out = []
  for (let lvl = 1; lvl <= 9; lvl++) {
    const t = totals[lvl] || 0
    if (t > 0) out.push({ level: lvl, count: t, current: currents ? (currents[lvl] ?? t) : t })
  }
  return out
}

function parseCharacter(el) {
  const c = {
    kind: el.tagName.toLowerCase(),
    label: '', name: '', level: '', size: '',
    ac: { value: null, source: '' },
    hp: { current: null, max: null, formula: '' },
    speed: '', init: '', passive: '',
    abilities: {}, saves: [], skills: [], languages: '',
    slots: [], spells: [], blocks: [],
  }
  for (const child of Array.from(el.children)) {
    const tag = child.tagName.toLowerCase()
    if (tag === 'save') { c.saves.push(text(child)); continue }
    if (tag === 'skill') { c.skills.push(text(child)); continue }
    if (tag === 'languages') { c.languages = text(child); continue }
    if (tag === 'slots') { c.slots = parseSlots(text(child)); continue }
    if (tag === 'spells') {
      c.spells = text(child).split(',').map((s) => s.trim()).filter(Boolean)
      continue
    }
    if (BLOCK_TYPES.has(tag)) {
      const nameEl = child.getElementsByTagName('name')[0]
      const textEl = child.getElementsByTagName('text')[0]
      let name = nameEl ? text(nameEl) : ''
      let body = textEl ? text(textEl) : ''
      if (!nameEl && !textEl) { name = text(child); body = '' } // e.g. <spell>Name</spell>
      c.blocks.push({ type: tag, name, text: body })
      continue
    }
    if (ABILITIES.includes(tag)) { c.abilities[tag] = text(child); continue }
    if (SCALAR.has(tag)) {
      const v = text(child)
      if (tag === 'ac') c.ac = parseAc(v)
      else if (tag === 'hp') c.hp = parseHp(v)
      else c[tag] = v
    }
  }
  return c
}

function childText(el, tag) {
  const t = tag.toLowerCase()
  for (const c of Array.from(el.children)) {
    if (c.tagName.toLowerCase() === t) return (c.textContent || '').trim()
  }
  return ''
}

function directChildren(el, tag) {
  const t = tag.toLowerCase()
  return Array.from(el.children).filter((c) => c.tagName.toLowerCase() === t)
}

function hasAncestor(el, tag) {
  let p = el.parentElement
  while (p) {
    if (p.tagName && p.tagName.toLowerCase() === tag) return true
    p = p.parentElement
  }
  return false
}

// A race/background/class feature is a <feat> with a <name> and one or more <text>.
function featObj(el) {
  const name = childText(el, 'name')
  const text = directChildren(el, 'text').map((t) => (t.textContent || '').trim()).join('\n\n')
  return { name, text }
}

function directFeats(el) {
  if (!el) return []
  return directChildren(el, 'feat').map(featObj).filter((f) => f.name)
}

// Extracts spells (name, level, prepared) from a player/internal file.
// s.j() writes <prepared>1</prepared> and <level> only for prepared/leveled spells.
function extractSpells(doc) {
  const out = []
  for (const sp of Array.from(doc.getElementsByTagName('spell'))) {
    const nameEl = sp.getElementsByTagName('name')[0]
    const name = nameEl ? nameEl.textContent.trim() : ''
    if (!name) continue
    const lvlEl = sp.getElementsByTagName('level')[0]
    const prepEl = sp.getElementsByTagName('prepared')[0]
    out.push({
      name,
      level: lvlEl ? (parseInt(lvlEl.textContent, 10) || 0) : 0,
      prepared: !!prepEl,
    })
  }
  return out
}

// Full detail from a player/internal file (roots <pc version="5"> or <data>).
function parsePlayer(doc) {
  const character = doc.getElementsByTagName('character')[0] || doc.documentElement
  const raceEl = doc.getElementsByTagName('race')[0]
  const bgEl = doc.getElementsByTagName('background')[0]
  const classEl = doc.getElementsByTagName('class')[0]

  // Items: <item><name/><quantity?/> (nested containers included). Dedup by name+qty.
  const items = []
  for (const it of Array.from(doc.getElementsByTagName('item'))) {
    const name = childText(it, 'name')
    if (!name) continue
    const q = childText(it, 'quantity')
    items.push({ name, quantity: q ? parseInt(q, 10) || 1 : 1 })
  }

  // Trackers the character actually has (skip the per-level reference ones inside
  // <autolevel>). Dedup by label, keeping the one with a current <value> if any.
  const trackers = []
  const seen = new Map()
  for (const tk of Array.from(doc.getElementsByTagName('tracker'))) {
    if (hasAncestor(tk, 'autolevel')) continue
    const label = childText(tk, 'label')
    if (!label) continue
    const t = { label, value: childText(tk, 'value'), formula: childText(tk, 'formula') }
    if (seen.has(label)) {
      const prev = seen.get(label)
      if (!prev.value && t.value) trackers[trackers.indexOf(prev)] = t, seen.set(label, t)
    } else {
      seen.set(label, t); trackers.push(t)
    }
  }

  // Spell slots live in the player file's <class> as direct-child <slots>
  // (max) and <slotsCurrent> (remaining); the ones inside <autolevel> are the
  // per-level reference table and must be ignored (childText = direct child).
  // Live spell slots are direct children of <character> ([cantrips, L1, L2, …]);
  // these track expenditure. The <class> element also has a <slots>/<slotsCurrent>
  // but those are static (they don't decrease when a slot is spent), so we ignore
  // them. The card prefers the GM export's totals and overlays `slotsCurrent`
  // here (remaining per level, indexed by level: slotsCurrent[L]); `slots` is the
  // fallback for when there is no GM file.
  const slotsTotal = parseCsvInts(childText(character, 'slots'))
  const slotsCurrent = parseCsvInts(childText(character, 'slotsCurrent'))
  const slots = slotsFromArrays(slotsTotal, slotsCurrent)

  return {
    spells: extractSpells(doc),
    items,
    trackers,
    slots,
    slotsCurrent,
    raceTraits: directFeats(raceEl),
    bgTraits: directFeats(bgEl),
    classTraits: directFeats(classEl),
    feats: directFeats(character), // character-level feats (not race/bg/class/autolevel)
  }
}

// Classifies a file and returns its contents.
//  - GM export  (root <characters>): { type:'gm', characters:[...] }
//  - Player/internal (root <pc>/<data>): { type:'player', spells:[...] }
export function parseFile(xmlString) {
  const doc = new DOMParser().parseFromString(xmlString, 'application/xml')
  if (doc.getElementsByTagName('parsererror').length) return { type: 'unknown' }
  const root = doc.documentElement ? doc.documentElement.tagName.toLowerCase() : ''
  if (root === 'characters') {
    const out = []
    for (const tag of ['pc', 'npc']) {
      for (const el of Array.from(doc.getElementsByTagName(tag))) out.push(parseCharacter(el))
    }
    return { type: 'gm', characters: out }
  }
  if (root === 'pc' || root === 'npc' || root === 'data') {
    return { type: 'player', player: parsePlayer(doc) }
  }
  return { type: 'unknown' }
}

export { mod, signed }
