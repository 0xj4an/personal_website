'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
  return (
    <div className="text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-bold sm:text-4xl"
      >
        Who is 0xj4an?
      </motion.h2>
      <p className="text-sm text-white/40 mb-6 -mt-6">Blockchain enthusiast · Community builder · Lifelong learner</p>

      <div className="flex flex-col lg:flex-row items-start">
        <div className="flex-shrink-0 mb-8 lg:mb-0 lg:mr-8">
          <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-40 h-40 flex items-center justify-center relative" style={{ boxShadow: '0 0 20px rgba(123, 63, 242, 0.2)' }}>
            <Image
              src="/Assets/Social Media Kit PFP.jpeg"
              alt="Cartoon skull with hat and glasses"
              fill
              className="object-cover rounded-xl border-2 border-purple-500/30 shadow-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('.fallback-initials');
                if (fallback instanceof HTMLElement) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            <span className="fallback-initials hidden absolute inset-0 items-center justify-center text-4xl font-bold text-[#4CC9F0]">JJ</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300"
          >
            0xj4an can be defined as a person who does not believe in social systems and is always looking for an alternative point of view. Since I was a child, I have been motivated to study and learn new things every day.
          </motion.p>
          
        </div>
      </div>
    </div>
  )
} 