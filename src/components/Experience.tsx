'use client'

import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const experiences = [
  {
    title: 'Volunteer Lead for ETHGlobal Brussels',
    company: 'ETHGlobal',
    period: 'July 2024',
    description: 'Supporting ETHGlobal as Volunteer Lead helping with the logistics of the ETHGlobal Brussels Pragma & Hackathon.',
    link: 'https://youtu.be/4yZZvIRqjX4'
  },
  {
    title: 'Volunteer Lead for ETHGlobal Sydney',
    company: 'ETHGlobal',
    period: 'May 2024',
    description: 'Supporting ETHGlobal as Volunteer Lead helping with the logistics of the ETHGlobal Sydney Pragma & Hackathon.',
    link: 'https://youtu.be/mhc32HNlF6A'
  },
  {
    title: 'Volunteer Lead for ETHGlobal London',
    company: 'ETHGlobal',
    period: 'March 2024',
    description: 'Supporting ETHGlobal as Volunteer Lead helping with the logistics of the ETHGlobal London Pragma & Hackathon.',
    link: 'https://youtu.be/-ybU_u3rYP8'
  },
  {
    title: 'Volunteer for Devconnect',
    company: 'Ethereum Foundation',
    period: 'October 2023',
    description: 'Supporting Ethereum Foundation as Volunteer helping with the logistics of Devconnect.',
    link: 'https://youtu.be/QoPFqV6jCTI'
  },
  {
    title: 'Volunteer Lead for ETHGlobal Istanbul',
    company: 'ETHGlobal',
    period: 'October 2023',
    description: 'Supporting ETHGlobal as Volunteer Lead helping with the logistics of the ETHGlobal Istanbul Pragma & Hackathon.',
    link: 'https://youtu.be/IHbLrA44KDw'
  },
  {
    title: 'Volunteer for ETHGlobal New York',
    company: 'ETHGlobal',
    period: 'September 2023',
    description: 'Supporting ETHGlobal as Volunteer helping with the logistics of the ETHGlobal New York Pragma & Hackathon.',
    link: 'https://youtu.be/2fbznQbAUkY'
  },
  {
    title: 'Volunteer for ETHGlobal Paris',
    company: 'ETHGlobal',
    period: 'July 2023',
    description: 'Supporting ETHGlobal as Volunteer helping with the logistics of the ETHGlobal Paris Pragma & Hackathon.',
    link: 'https://youtu.be/BPXIsO0Hanc'
  },
  {
    title: 'Volunteer for ETHGlobal Lisbon',
    company: 'ETHGlobal',
    period: 'May 2023',
    description: 'Supporting ETHGlobal as Volunteer helping with the logistics of the ETHGlobal Lisbon Pragma & Hackathon.',
    link: 'https://youtu.be/96_OCaFqQTg'
  },
  {
    title: 'Volunteer for ETHGlobal Tokyo',
    company: 'ETHGlobal',
    period: 'March 2023',
    description: 'Supporting ETHGlobal as Volunteer helping with the logistics of the ETHGlobal Tokyo Cafe and ETHGlobal Tokyo Hackathon.',
    link: 'https://youtu.be/yRwhpbD5XxA'
  },
  {
    title: 'Digital Support MetaSteward for ETHDenver',
    company: 'ETHDenver',
    period: 'February 2023',
    description: 'Supporting ETHDenver as MetaSteward for the Digital Support Team, leading Volunteers to help with the Discord Moderation and Twitch Streamings during the event and one month before.',
    link: 'https://youtu.be/FWcAjKGW8gU'
  },
  {
    title: 'Volunteer for ETHGlobal San Francisco',
    company: 'ETHGlobal',
    period: 'November 2022',
    description: 'Supporting ETHGlobal as Volunteer helping with the logistics of the ETHGlobal San Francisco Hackathon.',
    link: 'https://youtu.be/fHiIMvGLBZc'
  },
  {
    title: 'Volunteer for DevCon VI',
    company: 'Ethereum Foundation',
    period: 'October 2022',
    description: 'Supporting Ethereum Foundation as Volunteer helping with the logistics of DevCon VI.',
    link: 'https://youtu.be/lgTMm7J0t7c'
  },
]

const ACCENT = '#4ade80'

export default function Experience() {
  // Group by year (data is already newest first).
  const years: { year: string; items: typeof experiences }[] = []
  for (const exp of experiences) {
    const year = exp.period.split(' ').pop() ?? ''
    const group = years.find((g) => g.year === year)
    if (group) group.items.push(exp)
    else years.push({ year, items: [exp] })
  }

  return (
    <div>
      <SectionHeader
        kicker="04 / Events"
        title="Events"
        intro={`${experiences.length} Ethereum events supported as volunteer, volunteer lead and steward.`}
        color={ACCENT}
      />

      {years.map(({ year, items }) => (
        <section key={year} className="mt-8">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-gray-400">{year}</h3>
          <ol className="mt-3 space-y-3 border-l border-white/10 pl-5">
            {items.map((exp, index) => (
              <motion.li
                key={exp.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-white/20"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[27px] top-5 h-2.5 w-2.5 rounded-full"
                  style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
                />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gray-500">{exp.period}</span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-gray-300">{exp.company}</span>
                </div>
                <h4 className="mt-1.5 font-semibold text-white">{exp.title}</h4>
                {exp.description && <p className="mt-1.5 text-sm leading-relaxed text-gray-300">{exp.description}</p>}
                {exp.link && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1 text-xs text-gray-200 transition-colors hover:border-green-400/50 hover:text-white"
                  >
                    Watch recap
                  </a>
                )}
              </motion.li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
