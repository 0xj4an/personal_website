'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  color: string
  gradient?: string
}

export default function Modal({ isOpen, onClose, children, color }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%)',
              backdropFilter: 'blur(8px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl z-50"
            style={{
              background: 'rgba(10, 10, 10, 0.9)',
              border: `1px solid ${color}40`,
              boxShadow: `0 0 40px ${color}15, 0 0 80px ${color}08, inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            {/* Top accent line */}
            <div
              className="h-[2px] w-full rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            />
            <div className="relative p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-all duration-200 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 hover:rotate-90"
              >
                ×
              </button>
              <div className="text-white">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
