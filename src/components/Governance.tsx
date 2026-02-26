'use client'

import { motion } from 'framer-motion'

const proposals = [
  {
    cgp: 'CGP-0060',
    title: 'Colombian Peso StableCoin ($cCOP)',
    role: 'Author',
    status: 'WITHDRAWN',
    date: 'August 2022',
    description: 'Proposed introducing a stablecoin pegged to the Colombian Peso on Celo, leveraging Colombia\'s strong crypto adoption where 6.1% of the population owns crypto and ranks 4th globally for P2P Bitcoin trading.',
    link: 'https://forum.celo.org/t/proposal-to-introduce-colombian-peso-ccop-stable-coin',
  },
  {
    cgp: 'CGP-0076',
    title: 'LatAm Web3 DAO',
    role: 'Author',
    status: 'EXECUTED',
    date: 'March 2023',
    description: 'Established the LatAm Web3 DAO to grow the Celo community across Portuguese and Spanish-speaking Latin America, nurturing Web3 initiatives focused on ReFi use cases.',
    link: 'https://forum.celo.org/t/latam-w3-dao-proposal',
  },
  {
    cgp: 'CGP-0082',
    title: 'Celo Europe DAO Season 0',
    role: 'Author',
    status: 'PROPOSED',
    date: 'June 2023',
    description: 'Kicked off Celo Europe DAO Season 0, testing community growth through university activities, media exposure, Web3 conferences, hackathons, and institutional events across Europe.',
    link: 'https://forum.celo.org/t/celo-europe-dao',
  },
  {
    cgp: 'CGP-0120',
    title: 'Celo Europe H1 2024 Regional DAO',
    role: 'Co-Author',
    status: 'EXECUTED',
    date: 'February 2024',
    description: 'Continued Celo Europe DAO into H1 2024 with three pillars: events and community development, business development and investor relationships, and content production.',
    link: 'https://forum.celo.org/t/celo-europe-h1-2024-regional-dao-final',
  },
  {
    cgp: 'CGP-0152',
    title: 'Celo Governance Guild',
    role: 'Co-Author',
    status: 'EXECUTED',
    date: 'October 2024',
    description: 'Created and funded the Celo Governance Guild (formerly CGP Editors) to handle proposal review, coordination, governance call facilitation, and community engagement.',
    link: 'https://forum.celo.org/t/creation-of-celo-governance-guild',
  },
  {
    cgp: 'CGP-0165',
    title: 'Celo Communities Guild H1 2025',
    role: 'Co-Author',
    status: 'EXECUTED',
    date: 'February 2025',
    description: 'Funded the Communities Guild to sustain moderation across Discord, Telegram, Reddit, and X throughout H1 2025. The program has been active since August 2021.',
    link: 'https://forum.celo.org/t/celo-communities-guild-proposal-2025-h1-budget',
  },
  {
    cgp: 'CGP-0195',
    title: 'Celo Communities Guild H2 2025',
    role: 'Co-Author',
    status: 'EXECUTED',
    date: 'July 2025',
    description: 'Continued Communities Guild funding for July through December 2025, sustaining 24/7 moderation across Discord, Telegram, Reddit, and X.',
    link: 'https://forum.celo.org/t/celo-communities-guild-season-1-funding-request',
  },
  {
    cgp: 'CGP-0198',
    title: 'Celo Regional Council Season 1',
    role: 'Co-Author',
    status: 'REJECTED',
    date: 'August 2025',
    description: 'Proposed a decentralized coordination layer across the Celo ecosystem covering four macro-regions: Africa, Europe, LatAm, and Asia. This first version was rejected.',
    link: 'https://forum.celo.org/t/celo-regional-council-season-1-funding-request',
  },
  {
    cgp: 'CGP-0204',
    title: 'Celo Regional Council Season 1 V2',
    role: 'Co-Author',
    status: 'EXECUTED',
    date: 'September 2025',
    description: 'Revised version that consolidated ecosystem funding for all Regional Hubs under a transparent governance framework aligned with Vision 2030.',
    link: 'https://forum.celo.org/t/celo-regional-council-season-1-funding-request-v2',
  },
  {
    cgp: 'CGP-0219',
    title: 'Celo Communities Guild Season 2',
    role: 'Co-Author',
    status: 'PROPOSED',
    date: 'January 2026',
    description: 'Season 2 funding for the Communities Guild covering January through June 2026, continuing moderation across all platforms with expanded incentive budgets.',
    link: 'https://forum.celo.org/t/celo-communities-guild-season-2-funding-request',
  },
]

const statusColors: Record<string, string> = {
  EXECUTED: 'bg-green-500/20 text-green-400',
  PROPOSED: 'bg-blue-500/20 text-blue-400',
  WITHDRAWN: 'bg-gray-500/20 text-gray-400',
  REJECTED: 'bg-red-500/20 text-red-400',
  DRAFT: 'bg-yellow-500/20 text-yellow-400',
}

export default function Governance() {
  return (
    <section className="min-h-screen bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Governance
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-4 text-gray-400"
        >
          Celo Governance Guardian  - Overseeing the CGP process, reviewing proposals, and facilitating community governance.
        </motion.p>

        <div className="mt-12 space-y-6">
          {proposals.map((proposal, index) => (
            <motion.div
              key={proposal.cgp}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-8 border-l-2 border-white/10 hover:bg-white/5 rounded-r-lg transition-colors py-4"
            >
              <div className="absolute left-0 top-0 -translate-x-2 -translate-y-1">
                <div className="h-4 w-4 rounded-full bg-emerald-400"></div>
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-mono text-emerald-400">{proposal.cgp}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[proposal.status] || ''}`}>
                    {proposal.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                    {proposal.role}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mt-2">{proposal.title}</h3>
                <p className="text-sm text-gray-500">{proposal.date}</p>
                {proposal.description && (
                  <p className="mt-2 text-gray-300 text-sm">{proposal.description}</p>
                )}
                {proposal.link && (
                  <a href={proposal.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline mt-1 inline-block">
                    View Discussion
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-white/10"
        >
          <a
            href="https://github.com/celo-org/governance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:underline"
          >
            View Full Governance Repository
          </a>
        </motion.div>
      </div>
    </section>
  )
}
