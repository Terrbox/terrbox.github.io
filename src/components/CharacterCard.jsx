import { useState } from 'react'
import {
  Card, CardContent, Box, Typography, Chip, Divider, Stack, Tabs, Tab, Collapse,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import BoltIcon from '@mui/icons-material/Bolt'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TranslateIcon from '@mui/icons-material/Translate'
import Shield from './Shield.jsx'
import AbilityBox from './AbilityBox.jsx'

const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']

function Stat({ icon, label, value }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <Box sx={{ textAlign: 'center', minWidth: 58 }}>
      <Box sx={{ color: 'secondary.main', display: 'flex', justifyContent: 'center' }}>{icon}</Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{value}</Typography>
      <Typography sx={{ fontSize: 9, letterSpacing: 1, color: 'text.secondary', textTransform: 'uppercase' }}>
        {label}
      </Typography>
    </Box>
  )
}

// A plain, always-expanded list of features (name + text) — used for actions.
function PlainFeatureList({ features }) {
  return (
    <Stack spacing={1.25}>
      {features.map((f, i) => (
        <Box key={i}>
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{f.name}</Typography>
          {f.text ? (
            <Typography sx={{ fontSize: 12.5, color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
              {f.text}
            </Typography>
          ) : null}
        </Box>
      ))}
    </Stack>
  )
}

// A list of features (name + text), e.g. race/background/class traits or feats.
// Each shows only its title; clicking one with a description expands it, and
// clicking again collapses it.
function FeatureList({ features }) {
  const [open, setOpen] = useState(() => new Set())
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(prev)
    if (next.has(i)) next.delete(i); else next.add(i)
    return next
  })
  return (
    <Stack spacing={0.25}>
      {features.map((f, i) => {
        const hasText = !!f.text
        const isOpen = open.has(i)
        return (
          <Box key={i} sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 0.25 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}
                   onClick={hasText ? () => toggle(i) : undefined}
                   sx={{ cursor: hasText ? 'pointer' : 'default', userSelect: 'none' }}>
              <ExpandMoreIcon fontSize="small"
                sx={{ color: 'secondary.main', transition: 'transform .15s',
                      transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                      visibility: hasText ? 'visible' : 'hidden' }} />
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{f.name}</Typography>
            </Stack>
            {hasText ? (
              <Collapse in={isOpen} unmountOnExit>
                <Typography sx={{ fontSize: 12.5, color: 'text.secondary', whiteSpace: 'pre-wrap', pl: 3.5, pb: 0.5 }}>
                  {f.text}
                </Typography>
              </Collapse>
            ) : null}
          </Box>
        )
      })}
    </Stack>
  )
}

function SpellsTab({ c }) {
  const p = c.player
  // Slots: the player file's slots are the source of truth (they reflect the
  // character's real, possibly hand-edited, max AND the remaining count). The GM
  // export recomputes slots from the class table and drops any manual override,
  // so it is only a fallback for when there is no player file.
  const slots = (p && p.slots && p.slots.length) ? p.slots : c.slots
  // Only the prepared spells (plus cantrips, which are always available), grouped
  // by level — not the whole known/class list.
  const prepared = p && Array.isArray(p.spells)
    ? p.spells.filter((s) => s.level === 0 || s.prepared)
    : null
  const byLevel = new Map()
  if (prepared) for (const s of prepared) {
    if (!byLevel.has(s.level)) byLevel.set(s.level, [])
    byLevel.get(s.level).push(s)
  }
  const levels = [...byLevel.keys()].sort((a, b) => a - b)
  return (
    <Box>
      {slots.length > 0 && (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
          {slots.map((s) => {
            const cur = s.current == null ? s.count : s.current
            return (
              <Chip key={s.level} size="small" color="secondary" variant="outlined"
                    label={`Nivel ${ROMAN[s.level] || s.level}: ${cur}/${s.count}`} />
            )
          })}
        </Stack>
      )}
      {prepared ? (
        prepared.length ? (
          <Stack spacing={1}>
            {levels.map((lvl) => (
              <Box key={lvl}>
                <Typography sx={{ fontSize: 11, color: 'secondary.main', mb: 0.25 }}>
                  {lvl === 0 ? 'Trucos' : `Nivel ${ROMAN[lvl] || lvl}`}
                </Typography>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  {byLevel.get(lvl).map((s, i) => <Chip key={i} size="small" variant="outlined" label={s.name} />)}
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Sin conjuros preparados.</Typography>
      ) : c.spells && c.spells.length ? (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          {c.spells.map((s, i) => <Chip key={i} size="small" variant="outlined" label={s} />)}
        </Stack>
      ) : null}
    </Box>
  )
}

export default function CharacterCard({ c, detailsOpen = true }) {
  const [tab, setTab] = useState(0)
  const p = c.player || {}
  const actions = c.blocks.filter((b) => b.type === 'action')

  const hasSpells = c.slots.length > 0 || (p.slots && p.slots.length) ||
    (p.spells && p.spells.length) || (c.spells && c.spells.length)

  const tabs = []
  if (hasSpells) tabs.push({ label: 'Conjuros', render: () => <SpellsTab c={c} /> })
  if (p.items && p.items.length) tabs.push({
    label: `Objetos (${p.items.length})`,
    render: () => (
      <Stack spacing={0.5}>
        {p.items.map((it, i) => (
          <Stack key={i} direction="row" justifyContent="space-between" sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 0.25 }}>
            <Typography sx={{ fontSize: 13 }}>{it.name}</Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>×{it.quantity}</Typography>
          </Stack>
        ))}
      </Stack>
    ),
  })
  if (p.raceTraits && p.raceTraits.length) tabs.push({ label: 'Raza', render: () => <FeatureList features={p.raceTraits} /> })
  if (p.bgTraits && p.bgTraits.length) tabs.push({ label: 'Trasfondo', render: () => <FeatureList features={p.bgTraits} /> })
  if (p.classTraits && p.classTraits.length) tabs.push({ label: 'Clase', render: () => <FeatureList features={p.classTraits} /> })
  if (p.feats && p.feats.length) tabs.push({ label: 'Dotes', render: () => <FeatureList features={p.feats} /> })
  if (p.trackers && p.trackers.length) tabs.push({
    label: 'Trackers',
    render: () => (
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
        {p.trackers.map((t, i) => (
          <Chip key={i} color="secondary" variant="outlined"
                label={t.value !== '' ? `${t.label}: ${t.value}/${t.formula || t.value}` : `${t.label}: ${t.formula || '—'}`} />
        ))}
      </Stack>
    ),
  })
  if (actions.length) tabs.push({ label: 'Acciones', render: () => <PlainFeatureList features={actions} /> })

  const active = Math.min(tab, Math.max(0, tabs.length - 1))

  return (
    <Card elevation={6} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: '2px solid', borderColor: 'primary.main',
                 background: 'linear-gradient(180deg, rgba(193,39,45,0.18), rgba(0,0,0,0))' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h6" sx={{ lineHeight: 1.15 }}>{c.label || c.name || '(sin nombre)'}</Typography>
          <Chip size="small" label={c.kind === 'npc' ? 'NPC' : 'PJ'}
                color={c.kind === 'npc' ? 'default' : 'primary'} sx={{ fontWeight: 700 }} />
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {[c.name, c.size, c.level ? `Nivel ${c.level}` : null].filter(Boolean).join(' · ')}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <Shield value={c.ac.value} source={c.ac.source} />
          <Stat icon={<FavoriteIcon fontSize="small" />} label="PV"
                value={c.hp.max ? `${c.hp.current ?? c.hp.max}/${c.hp.max}` : c.hp.current} />
          <Stat icon={<DirectionsRunIcon fontSize="small" />} label="Vel" value={c.speed} />
          <Stat icon={<BoltIcon fontSize="small" />} label="Inic" value={c.init} />
          <Stat icon={<VisibilityIcon fontSize="small" />} label="P.Percep" value={c.passive} />
        </Stack>
        {c.hp.formula ? (
          <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>PV: {c.hp.formula}</Typography>
        ) : null}

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          {ABILITIES.map((a) => <AbilityBox key={a} ability={a} score={c.abilities[a]} />)}
        </Stack>

        {c.saves.length ? (
          <Section title="Salvaciones">{c.saves.map((s, i) => <Chip key={i} size="small" variant="outlined" label={s} />)}</Section>
        ) : null}
        {c.skills.length ? (
          <Section title="Habilidades">{c.skills.map((s, i) => <Chip key={i} size="small" variant="outlined" label={s} />)}</Section>
        ) : null}
        {(c.languages || tabs.length > 0) && (
          <Collapse in={detailsOpen} unmountOnExit>
            {c.languages ? (
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.5 }}>
                <TranslateIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{c.languages}</Typography>
              </Stack>
            ) : null}

            {tabs.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Tabs value={active} onChange={(e, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
                      sx={{ minHeight: 36, mb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  {tabs.map((t, i) => <Tab key={i} label={t.label} sx={{ minHeight: 36, py: 0.5, fontSize: 12 }} />)}
                </Tabs>
                <Box>{tabs[active].render()}</Box>
              </Box>
            )}
          </Collapse>
        )}
      </CardContent>
    </Card>
  )
}

function Section({ title, children }) {
  return (
    <Box sx={{ mt: 1.5 }}>
      <Typography variant="overline">{title}</Typography>
      <Divider sx={{ mb: 0.75 }} />
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>{children}</Stack>
    </Box>
  )
}
