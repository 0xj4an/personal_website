'use client'

import { motion } from 'framer-motion'

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

export default function Speaker() {
  return (
    <section className="min-h-screen bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Speaking
        </motion.h2>

        <div className="mt-12 space-y-8">
          {speakingEngagements.map((talk, index) => (
            <motion.div
              key={talk.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 border-l-2 border-white/10 hover:bg-white/5 rounded-r-lg transition-colors py-4"
            >
              <div className="absolute left-0 top-0 -translate-x-2 -translate-y-1">
                <div className="h-4 w-4 rounded-full bg-green-400"></div>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white">{talk.title}</h3>
                <p className="text-gray-400">{talk.event}</p>
                <p className="text-sm text-gray-500">{talk.period}</p>
                {talk.description && (
                  <p className="mt-2 text-gray-300">{talk.description}</p>
                )}
                {talk.link && (
                  <a href={talk.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline mt-1 inline-block">
                    Watch Video
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
