'use client'

import { motion } from 'framer-motion'

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
    title: 'Volunteer Lead for ETHGlobal Instanbul',
    company: 'ETHGlobal',
    period: 'October 2023',
    description: 'Supporting ETHGlobal as Volunteer Lead helping with the logistics of the ETHGlobal Instanbul Pragma & Hackathon.',
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
    title: 'Participation in a DeFi summit',
    company: 'Próspera DeFi Summit',
    period: 'December 2022',
    description: 'Participation in a DeFi summit in Próspera Especial Economic Development Zone – ZEDE, in Roatán, Bay Islands, Honduras.',
    link: undefined
  },
  {
    title: 'Volunteer for ETHGlobal SanFrancisco',
    company: 'ETHGlobal',
    period: 'November 2022',
    description: 'Supporting ETHGlobal as Volunteer helping with the logistics of the ETHGlobal SanFrancisco Hackathon.',
    link: 'https://youtu.be/fHiIMvGLBZc'
  },
  {
    title: 'Participation as Speaker',
    company: 'Sustainable Blockchain Summit LATAM',
    period: 'October 2022',
    description: 'Participation as Speaker with the talk «How NFT Technology Can Help Monitor & Commit to a True Protection of The Green Arks of the Planet« In this talk there will be a brief description of the ineffectiveness of the state in the protection of nature reserves, forests, water sources, etc. and the lack of commitment or logistics of immediate reaction to prevent and protect environmental damage.',
    link: undefined
  },
  {
    title: 'Volunteer for DevCon VI',
    company: 'Ethereum Foundation',
    period: 'October 2022',
    description: 'Supporting Ethereum Foundation as Volunteer helping with the logistics of DevCon VI.',
    link: 'https://youtu.be/lgTMm7J0t7c'
  },
  {
    title: 'Participation in panel «DAOs in Latam, ¿The next big revolution in the crypto ecosystem?»',
    company: 'Blockchain Summit Latam',
    period: 'Jul 2022',
    description: undefined,
    link: 'https://youtu.be/1VX9JSf6U9s?t=8258'
  }
]

export default function Experience() {
  return (
    <section id="experience" className="min-h-screen bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Experience
        </motion.h2>

        <div className="mt-12 space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
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
                <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                <p className="text-gray-400">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
                {exp.description && (
                  <p className="mt-2 text-gray-300">{exp.description}</p>
                )}
                {exp.link && (
                  <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                    Watch Recap
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