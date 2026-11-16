'use client'

import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const studies = [
  {
    degree: "Technology in systems",
  },
  {
    degree: "Agricultural Engineering",
  },
  {
    degree: "Specialization in Preparation and Evaluation of Private Projects.",
  },
  {
    degree: "Master's degree in Project Management.",
  },
  {
    degree: "Specialist in State Contracting.",
  },
]

export default function Studies() {
  return (
    <div className="text-white">
      <SectionHeader kicker="03 / Education" title="Studies" color="#ffd700" />

      <div className="mt-8 space-y-3">
        {studies.map((study, index) => (
          <motion.div
            key={study.degree}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
          >
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-yellow-400" style={{ boxShadow: '0 0 8px #ffd700' }} />
            <h3 className="font-semibold text-white">{study.degree.replace(/\.$/, '')}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 