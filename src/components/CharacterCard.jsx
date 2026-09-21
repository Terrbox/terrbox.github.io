import {
  Card, CardContent, Box, Typography, Chip, Divider, Stack,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import BoltIcon from '@mui/icons-material/Bolt'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TranslateIcon from '@mui/icons-material/Translate'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Shield from './Shield.jsx'
import AbilityBox from './AbilityBox.jsx'

const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const BLOCK_LABEL = { action: 'Acciones', trait: 'Rasgos', reaction: 'Reacciones', legendary: 'Legendarias' }
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

export default function CharacterCard({ c }) {
  const blocks = {}
  for (const b of c.blocks) (blocks[b.type] ||= []).push(b)

  // Prepared spells (from the matching player file): cantrips always shown,
  // leveled spells only if prepared. Grouped by level.
  const prepared = Array.isArray(c.preparedSpells)
    ? c.preparedSpells.filter((s) => s.level === 0 || s.prepared)
    : null
  const byLevel = new Map()
  if (prepared) {
    for (const s of prepared) {
      if (!byLevel.has(s.level)) byLevel.set(s.level, [])
      byLevel.get(s.level).push(s)
    }
  }
  const levels = [...byLevel.keys()].sort((a, b) => a - b)
  const hasSpells = Boolean((prepared && prepared.length) || c.slots.length || (c.spells && c.spells.length))

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
          {[c.name, c.size, c.level ? `Nivel ${c.level}` : null]
            .filter(Boolean).join(' · ')}
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
          {ABILITIES.map((a) => (
            <AbilityBox key={a} ability={a} score={c.abilities[a]} />
          ))}
        </Stack>

        {c.saves.length ? (
          <Section title="Salvaciones">
            {c.saves.map((s, i) => <Chip key={i} size="small" variant="outlined" label={s} />)}
          </Section>
        ) : null}

        {c.skills.length ? (
          <Section title="Habilidades">
            {c.skills.map((s, i) => <Chip key={i} size="small" variant="outlined" label={s} />)}
          </Section>
        ) : null}

        {c.languages ? (
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.5 }}>
            <TranslateIcon fontSize="small" sx={{ color: 'secondary.main' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{c.languages}</Typography>
          </Stack>
        ) : null}

        {hasSpells && (
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="overline">Conjuros</Typography>
            <Divider sx={{ mb: 0.75 }} />
            {c.slots.length > 0 && (
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                {c.slots.map((s) => (
                  <Chip key={s.level} size="small" color="secondary" variant="outlined"
                        label={`Nivel ${ROMAN[s.level] || s.level}: ${s.count}`} />
                ))}
              </Stack>
            )}

            {prepared ? (
              prepared.length ? (
                <Stack spacing={0.75}>
                  {levels.map((lvl) => (
                    <Box key={lvl}>
                      <Typography sx={{ fontSize: 11, color: 'secondary.main', mb: 0.25 }}>
                        {lvl === 0 ? 'Trucos' : `Nivel ${ROMAN[lvl] || lvl}`}
                      </Typography>
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                        {byLevel.get(lvl).map((s, i) => (
                          <Chip key={i} size="small" variant="outlined" label={s.name} />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Sin conjuros preparados.</Typography>
              )
            ) : c.spells && c.spells.length ? (
              <Box>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.5 }}>
                  Conjuros ({c.spells.length})
                </Typography>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  {c.spells.map((s, i) => <Chip key={i} size="small" variant="outlined" label={s} />)}
                </Stack>
              </Box>
            ) : null}
          </Box>
        )}

        {Object.keys(blocks).map((type) => (
          <Accordion key={type} disableGutters sx={{ mt: 1.5, background: 'rgba(0,0,0,0.2)' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 700 }}>
                {BLOCK_LABEL[type] || type} ({blocks[type].length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1}>
                {blocks[type].map((b, i) => (
                  <Box key={i}>
                    {b.name ? <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{b.name}</Typography> : null}
                    {b.text ? <Typography sx={{ fontSize: 13, color: 'text.secondary', whiteSpace: 'pre-wrap' }}>{b.text}</Typography> : null}
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
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
