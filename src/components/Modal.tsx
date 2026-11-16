'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  color: string
  label: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({ isOpen, onClose, children, color, label }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Escape closes, Tab stays inside the dialog, focus returns to the opener on close.
  useEffect(() => {
    if (!isOpen) return
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [isOpen])

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
            aria-hidden="true"
            className="fixed inset-0 z-40"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.85) 100%)',
              backdropFilter: 'blur(8px)',
            }}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
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
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-all duration-200 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 hover:rotate-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:text-white"
              >
                <span aria-hidden="true">&times;</span>
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
