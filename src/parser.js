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

// Extracts spells (name, level, prepared) from a player/internal file
// (roots <pc version="5"> or <data>). s.j() writes <prepared>1</prepared> and
// <level> only for prepared/leveled spells; presence of <prepared> == prepared.
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
    return { type: 'player', spells: extractSpells(doc) }
  }
  return { type: 'unknown' }
}

export { mod, signed }
