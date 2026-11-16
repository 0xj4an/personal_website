'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  kicker: string
  title: string
  intro?: string
  color: string
}

// Shared heading for every section panel: same type scale, spacing and accent
// treatment as the planet labels in the galaxy.
export default function SectionHeader({ kicker, title, intro, color }: SectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="pr-10"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color }}>
        {kicker}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
      <div
        className="mt-3 h-px w-16"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      {intro && <p className="mt-4 text-sm leading-relaxed text-gray-400">{intro}</p>}
    </motion.header>
  )
}
