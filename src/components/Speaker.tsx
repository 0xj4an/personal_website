'use client'

import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const speakingEngagements = [
  {
    title: 'Keynote: «Stablecoins for the People: On-Chain Subsidies and Frictionless Web3 Onboarding in Colombia»',
    event: 'ETHCluj 2026 · Day 2 Business Stage (Usability & Adoption track)',
    period: 'May 2026',
    description: 'Keynote at ETHCluj 2026 (May 14) covering how ReFi Colombia built a stablecoin-powered subsidy platform on Celo that delivers real value to communities while onboarding people into Web3 without friction. The talk covers how it was built, the impact so far, and why this model is replicable anywhere.',
    link: 'https://www.youtube.com/live/_RVMChZQ_EQ?t=21210',
  },
  {
    title: 'Keynote: «Virtual State Blockchains on Ethereum»',
    event: 'ETHCluj 2026 · Day 1 Business Stage',
    period: 'May 2026',
    description: 'Advanced-level keynote at ETHCluj 2026 (May 13, Cluj-Napoca, Romania). Ethereum has scaled horizontally through rollups, but many applications still need more flexible execution patterns. This talk introduced virtual state blockchains: chain-like environments deployed in Solidity, with isolated state, async nonces, executors, zkVaults, FHE confidentiality, and abstracted UX. The result is a practical way to experiment with new execution models without new infrastructure.',
    link: 'https://www.youtube.com/live/khou85jtmQE?t=18804',
  },
  {
    title: 'Talk: «Virtual State Blockchains on Ethereum»',
    event: 'ETHPrague 2026',
    period: 'May 2026',
    description: 'Co-presented with German Abal at ETHPrague 2026 (May 8-10, Prague). Introduced virtual state blockchains (EVVM): chain-like environments deployed in Solidity with isolated state, async nonces, executors, zkVaults, FHE confidentiality, and abstracted UX. A practical way to experiment with new execution models on Ethereum without new infrastructure.',
    link: 'https://www.youtube.com/watch?v=Ckziq-5I3pQ',
  },
  {
    title: 'Participation in DeFi Summit',
    event: 'Próspera DeFi Summit',
    period: 'December 2022',
    description: 'Participation in a DeFi summit in Próspera Special Economic Development Zone (ZEDE), in Roatán, Bay Islands, Honduras.',
  },
  {
    title: 'Participation as Speaker',
    event: 'Sustainable Blockchain Summit LATAM',
    period: 'October 2022',
    description: 'Talk: «How NFT Technology Can Help Monitor & Commit to a True Protection of The Green Arks of the Planet». Explored the ineffectiveness of the state in protecting nature reserves, forests, and water sources, and the lack of immediate reaction to prevent environmental damage.',
  },
  {
    title: 'Panel: «DAOs in Latam, The next big revolution in the crypto ecosystem?»',
    event: 'Blockchain Summit Latam',
    period: 'July 2022',
    description: 'Participation in panel discussion about the future of DAOs in Latin America and their potential impact on the crypto ecosystem.',
    link: 'https://youtu.be/1VX9JSf6U9s?t=8258',
  },
]

const ACCENT = '#4ade80'

export default function Speaker() {
  return (
    <div>
      <SectionHeader
        kicker="04 / Speaking"
        title="Speaking"
        intro="Keynotes, talks and panels on stablecoins, virtual state blockchains, DAOs and ReFi."
        color={ACCENT}
      />

      <div className="mt-8 space-y-4">
        {speakingEngagements.map((talk, index) => (
          <motion.article
            key={talk.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-white/20"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gray-500">{talk.period}</span>
              <span className="text-xs" style={{ color: ACCENT }}>{talk.event}</span>
            </div>
            <h3 className="mt-2 font-semibold leading-snug text-white">{talk.title}</h3>
            {talk.description && <p className="mt-2 text-sm leading-relaxed text-gray-300">{talk.description}</p>}
            {talk.link && (
              <a
                href={talk.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center rounded-md bg-green-500/15 px-3 py-1 text-xs font-medium text-green-200 transition-colors hover:bg-green-500/25"
              >
                Watch video
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  )
}
