'use client'

import { motion } from 'framer-motion'

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
  }
]

export default function Studies() {
  return (
    <div className="text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-bold sm:text-4xl"
      >
        Education
      </motion.h2>
      
      <div className="space-y-8">
        {studies.map((study, index) => (
          <motion.div
            key={study.degree}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="rounded-lg bg-white/5 border border-white/10 p-6"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-white">{study.degree}</h3>
              </div>
              {/* Removed school, period, and description rendering */}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 