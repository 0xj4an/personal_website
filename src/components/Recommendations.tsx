'use client'

import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

interface Recommendation {
  name: string
  quote: string
}

const ACCENT = '#a9e34b'

const recommendations: Recommendation[] = [
  {
    name: '0xgoldo',
    quote:
      'I have worked alongside 0xj4an since 2022 as a fellow moderator and governance guardian, and he consistently stands out for his drive and reliability. 0xj4an is highly hands on, efficient, and proactive in everything he takes on. He is the kind of person you can count on without hesitation, always available and ready to step in when needed. His strong sense of responsibility and commitment to the community make him a valuable presence in any team environment. Working with him has always meant working with someone who truly cares about getting things done properly and on time.',
  },
  {
    name: 'Anna Kaic',
    quote:
      'I have worked with 0xj4an in multiple occasions and he is one of the few professionals I would trust fully. His work ethics and people management skills are at a high level and his professionalism is unmatched. He delivers on his commitments every single time.',
  },
  {
    name: 'Tereza',
    quote:
      "0xj4an is a community builder at heart and one of the best I have encountered in the web3 and public goods space. He brings genuine knowledge across the ecosystem, a generalist's range spanning fundraising, project coordination, and strategy, and a rare ability to connect people and move things forward. Thoughtful, dependable, and always invested in the work, he is the kind of person who makes every project stronger.",
  },
]

// People with a recommendation on the way (they also have a moon in the galaxy).
export const pendingRecommenders = ['Anna', 'z0z', 'Marek', 'Rene', 'Luuk']

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

// focusName: set when opened from a moon. That person's card goes first and
// is highlighted, so it is the first thing people read.
export default function Recommendations({ focusName }: { focusName?: string }) {
  const pendingFocused = focusName !== undefined && pendingRecommenders.includes(focusName)
  const ordered = [...recommendations].sort(
    (a, b) => Number(b.name === focusName) - Number(a.name === focusName)
  )

  return (
    <div>
      <SectionHeader
        kicker="05 / Kind words"
        title="Recommendations"
        intro="What people I have built, moderated and organized with say."
        color={ACCENT}
      />

      {pendingFocused && (
        <p
          className="mt-8 rounded-xl border px-5 py-4 text-sm"
          style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}0d`, color: '#e5f7c0' }}
        >
          {focusName}&apos;s recommendation is on the way.
        </p>
      )}

      <div className="mt-8 space-y-5">
        {ordered.map((rec, index) => {
          const focused = rec.name === focusName
          return (
            <motion.figure
              key={rec.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              className="relative overflow-hidden rounded-xl border p-6 transition-colors"
              style={{
                borderColor: focused ? `${ACCENT}99` : 'rgba(255,255,255,0.08)',
                background: focused ? `${ACCENT}0d` : 'rgba(255,255,255,0.025)',
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 right-4 select-none font-serif text-8xl leading-none"
                style={{ color: `${ACCENT}26` }}
              >
                &quot;
              </span>
              <blockquote className="relative text-[15px] leading-relaxed text-gray-200">
                {rec.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-black"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #4ade80)` }}
                >
                  {rec.name.replace(/^0x/, '').charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold text-white">{rec.name}</span>
              </figcaption>
            </motion.figure>
          )
        })}
      </div>

      {pendingRecommenders.length > 0 && (
        <p className="mt-6 rounded-lg border border-white/[0.06] px-4 py-3 text-sm text-gray-400">
          More on the way from {joinNames(pendingRecommenders)}.
        </p>
      )}
    </div>
  )
}
