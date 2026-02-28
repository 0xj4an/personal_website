'use client'

import { motion } from 'framer-motion'

export default function Biography() {
  return (
    <div className="text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-bold sm:text-4xl"
      >
        My Journey
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-gray-300"
      >
        I&apos;ve always been curious about how things work and drawn to looking at problems from unexpected angles. That curiosity has led me through a pretty diverse path, connecting dots between fields that don&apos;t usually overlap.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-lg text-gray-300"
      >
        Academic background:
        <ul className="list-disc mt-2 ml-6 space-y-1">
          <li>Technology in Systems</li>
          <li>Agricultural Engineering, National University of Colombia</li>
          <li>Specialization in Preparation and Evaluation of Private Projects</li>
          <li>Master&apos;s in Project Management</li>
          <li>Specialist in State Contracting</li>
        </ul>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-lg text-gray-300"
      >
        Growing up I wanted to fly planes, and studying aviation was my way of chasing that. Tech was always there too, first as a hobby, then as something more serious. Finance became a real interest during university. I spent a lot of time studying the Colombian Stock Exchange, macroeconomic theory, technical analysis, and eventually started trading with brokers.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-lg text-gray-300"
      >
        When I found blockchain and crypto, everything clicked. Tech, finance, governance, even agriculture. It was the intersection of all the things I cared about. That led me into the Celo ecosystem, where I&apos;ve been working on governance, community building, and coordination across Latin America and Europe ever since.
      </motion.p>
    </div>
  )
} 