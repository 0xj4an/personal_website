'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
  return (
    <div className="text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-bold sm:text-4xl"
      >
        0xj4an
      </motion.h2>
      <p className="text-sm text-white/40 mb-6 -mt-6">Blockchain governance · Community building · Web3 coordination</p>

      <div className="flex flex-col lg:flex-row items-start">
        <div className="flex-shrink-0 mb-8 lg:mb-0 lg:mr-8">
          <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg w-40 h-40 flex items-center justify-center relative" style={{ boxShadow: '0 0 20px rgba(123, 63, 242, 0.2)' }}>
            <Image
              src="/Assets/Social Media Kit PFP.jpeg"
              alt="0xj4an profile"
              fill
              className="object-cover rounded-xl border-2 border-purple-500/30 shadow-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('.fallback-initials');
                if (fallback instanceof HTMLElement) {
                  fallback.style.display = 'flex';
                }
              }}
            />
            <span className="fallback-initials hidden absolute inset-0 items-center justify-center text-4xl font-bold text-[#4CC9F0]">0x</span>
          </div>
          <div className="flex gap-3 mt-4 justify-center">
            <a href="https://x.com/0xj4an" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="X / Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://github.com/0xj4an" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://t.me/x0xj4an" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Telegram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="mailto:hello@0xj4an.xyz" className="text-gray-400 hover:text-white transition-colors" title="Email">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300"
          >
            Governance guardian, community builder, and coordinator in the Celo ecosystem. Involved in 23+ governance proposals, volunteered at 12+ ETHGlobal and Ethereum events, and active across multiple DAOs and regional communities in Latin America and Europe.
          </motion.p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-purple-400">23+</p>
              <p className="text-xs text-gray-400">CGP Proposals</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-teal-400">12+</p>
              <p className="text-xs text-gray-400">Events Volunteered</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-green-400">3+</p>
              <p className="text-xs text-gray-400">Years in Governance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 