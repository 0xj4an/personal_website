'use client'

import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

interface Project {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
}

const projects: Project[] = [
  {
    title: 'Celo Blockchain Moderator',
    description: 'Moderator for the Celo Blockchain Discord server, helping new users, creating educational content in Spanish, and onboarding communities. Successfully brought the first community needing economic aid into the ImpactMarket protocol with pilot tests in Medellin, Colombia. Established a community of young athletes to help improve their life opportunities.',
    tags: ['Celo', 'Blockchain', 'Moderation', 'Community Building', 'ImpactMarket'],
    gradient: 'from-lime-500 to-green-500',
  },
  {
    title: 'Immortal DAO Moderator',
    description: 'Moderator for the Immortal DAO project on the Celo network. Created content in Spanish and helped translate all project documentation.',
    tags: ['Celo', 'DAO', 'Moderation', 'Translation'],
    gradient: 'from-blue-500 to-teal-500',
  },
  {
    title: 'Celo Colombian Peso Stablecoin ($cCOP)',
    description: 'Proposed the creation of a stablecoin pegged to the Colombian Peso on Celo (CGP-0060). Created the forum discussion post and submitted the governance proposal to advance adoption in Colombia.',
    tags: ['Celo', 'Stablecoin', 'Governance', 'Proposal'],
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    title: 'Forestry NFT Project',
    description: 'Conceptualizing a forestry project based on NFT technology in Colombia, exploring how blockchain can support reforestation and sustainable land use.',
    tags: ['NFTs', 'Forestry', 'ReFi'],
    gradient: 'from-green-700 to-lime-700',
  },
  {
    title: 'Farcaster Agent Bot',
    description: 'Automated Farcaster/Warpcast agent focused on the ReFi and Celo community in Colombia. Posts curated messages (320+) on a randomized 24-hour cycle, auto-engages with community accounts via the Neynar API, and publishes weekly insights with monthly archiving and anti-repetition logic.',
    tags: ['Farcaster', 'Celo', 'ReFi', 'Node.js', 'Neynar API'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'VigilBot.eth (ETHPrague 2026 Hackathon)',
    description: 'Co-built an autonomous AI security agent that monitors Ethereum proxy contract upgrades in real time. On detecting an EIP-1967 upgrade, it verifies the new implementation on Sourcify, compares storage layouts and ABIs, scores severity, and generates plain-English summaries via GPT-4o. The agent autonomously pays for contextual intelligence via Apify micropayments, publishes findings permanently to Swarm, sends Telegram alerts, and records reputation on ENS subdomains under vigilbot.eth. Won the Swarm "Ethereum Chain State on Swarm" bounty.',
    tags: ['ETHPrague 2026', 'AI Agent', 'Ethereum Security', 'Swarm', 'ENS', 'TypeScript', 'GPT-4o'],
    gradient: 'from-indigo-500 to-violet-500',
  },
]

export default function Projects() {
  return (
    <div>
      <div>
        <SectionHeader kicker="06 / Builds" title="Projects" color="#ff79c6" />

        <div className="mt-8 flex flex-col gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-white/20"
            >
              <div>
                <h3 className="font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-sm text-gray-300">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.07] border border-white/10 px-3 py-1 text-xs text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 