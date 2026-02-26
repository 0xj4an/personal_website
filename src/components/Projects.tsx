'use client'

import { motion } from 'framer-motion'

interface Project {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
}

const projects: Project[] = [
  {
    title: 'Celo Blockchain Moderator',
    description: 'Contributing from the role of Moderator for the Celo Blockchain, always looking to help new users to get solves his doubts in the Discord Server, helping to educate people about the uses and benefits, create content in Spanish. Succesfully onboard the first community that need economic aid to participate in the ImpactMarket protocol and carry out pilot tests in Medellín, Colombia. Currently, a community of young athletes has already been established to help them improve their life opportunities.',
    tags: ['Celo', 'Blockchain', 'Moderation', 'Community Building', 'ImpactMarket'],
    gradient: 'from-lime-500 to-green-500',
  },
  {
    title: 'Immortal DAO Moderator',
    description: 'Contributing from the role of Moderator in the Immortal DAO project that runs on the Celo network, always looking to create content in Spanish and helping with the translation of all project documentation.',
    tags: ['Celo', 'DAO', 'Moderation', 'Translation'],
    gradient: 'from-blue-500 to-teal-500',
  },
  {
    title: 'Celo Colombian Peso Stablecoin',
    description: 'Looking forward for the creation of a new Stablecoin pegged to the Colombian Peso in the Celo network, seeking to improve the adoption of this Blockchain and contribute to growth. Already created the discussion post in the Celo Forum. Already submited a CGP Proposal to Celo Governance.',
    tags: ['Celo', 'Stablecoin', 'Governance', 'Proposal'],
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    title: 'Future: Forestry NFT Project',
    description: 'Actually in the conceptualization phase of a Forestry project based on NFT technology in Colombia.',
    tags: ['NFTs', 'Forestry', 'ReFi'],
    gradient: 'from-green-700 to-lime-700',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="min-h-screen bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Projects
        </motion.h2>

        <div className="mt-12 flex flex-col gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-white/10 pb-6 last:border-b-0"
            >
              <div className="p-0">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
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
    </section>
  )
} 