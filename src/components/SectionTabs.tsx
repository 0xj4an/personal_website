'use client'

import { useId, useRef } from 'react'
import type { SubSection } from '@/app/page'

interface SectionTabsProps {
  label: string
  color: string
  subSections: SubSection[]
  index: number
  onChange: (index: number) => void
}

// Hub for planets with moons: every sub-section is reachable from the parent
// planet (and the keyboard), not only from the small orbiting moons.
export default function SectionTabs({ label, color, subSections, index, onChange }: SectionTabsProps) {
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const Active = subSections[index]?.Component

  const focusTab = (next: number) => {
    const wrapped = (next + subSections.length) % subSections.length
    onChange(wrapped)
    tabRefs.current[wrapped]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); focusTab(index + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusTab(index - 1) }
    else if (e.key === 'Home') { e.preventDefault(); focusTab(0) }
    else if (e.key === 'End') { e.preventDefault(); focusTab(subSections.length - 1) }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-2 pr-10"
      >
        {subSections.map((sub, i) => {
          const selected = i === index
          return (
            <button
              key={sub.name}
              ref={(el) => { tabRefs.current[i] = el }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(i)}
              className="rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              style={
                selected
                  ? { borderColor: color, background: `${color}26`, color: '#ffffff' }
                  : { borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }
              }
            >
              {sub.name}
            </button>
          )
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${index}`}
        className="mt-6"
      >
        {Active && <Active key={index} />}
      </div>
    </div>
  )
}
