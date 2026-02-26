'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  isLoaded: boolean
}

export default function LoadingScreen({ isLoaded }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-white mb-8"
          >
            0xj4an
          </motion.h1>
          <div className="relative w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 rounded-full"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-white/50"
          >
            Entering the universe...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
