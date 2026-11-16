'use client'

import { useMemo, useState } from 'react'
import SectionHeader from './SectionHeader'

const proposals = [
  // 2026
  { cgp: 'CGP-0231', title: 'CICLOPS Season 2 Funding Request', role: 'On-chain Submitter', status: 'EXECUTED', date: 'February 2026', description: 'Submitted on-chain a proposal by Nauman Mustafa seeking $2.7M equivalent in CELO to sustain critical Celo infrastructure including wallets, indexers, oracles, explorers, and monitoring tools.', link: 'https://forum.celo.org/t/ciclops-season-2-funding-request', mondoLink: 'https://mondo.celo.org/governance/cgp-231' },
  { cgp: 'CGP-0230', title: 'Increase Intrinsic Gas for USDT and USDC Fee Currencies', role: 'On-chain Submitter', status: 'PROPOSED', date: 'February 2026', description: 'Submitted on-chain a proposal by cLabs to increase intrinsic gas parameters for USDT and USDC in the FeeCurrencyDirectory contract to correct gas pricing misalignment based on mainnet measurements.', link: 'https://forum.celo.org/t/increase-intrinsic-gas-for-usdt-and-usdc-fee-currencies', mondoLink: 'https://mondo.celo.org/governance/cgp-230' },
  { cgp: 'CGP-0223', title: 'Celo Governance Guild Season 2', role: 'Lead Author', status: 'EXECUTED', date: 'February 2026', description: 'Led the Season 2 funding request for the Governance Guild covering the 2026 governance year, including governance call operations, proposal lifecycle support, documentation, and community enablement.', link: 'https://forum.celo.org/t/celo-governance-guild-season-2-funding-request', mondoLink: 'https://mondo.celo.org/governance/cgp-223' },
  { cgp: 'CGP-0219', title: 'Celo Communities Guild Season 2', role: 'Co-Author', status: 'EXECUTED', date: 'January 2026', description: 'Season 2 funding for the Communities Guild covering January through June 2026, continuing moderation across all platforms with expanded incentive budgets.', link: 'https://forum.celo.org/t/celo-communities-guild-season-2-funding-request', mondoLink: 'https://mondo.celo.org/governance/cgp-219' },
  // 2025
  { cgp: 'CGP-0204', title: 'Celo Regional Council Season 1 V2', role: 'Co-Author', status: 'EXECUTED', date: 'September 2025', description: 'Revised version that consolidated ecosystem funding for all Regional Hubs under a transparent governance framework aligned with Vision 2030.', link: 'https://forum.celo.org/t/celo-regional-council-season-1-funding-request-v2', mondoLink: 'https://mondo.celo.org/governance/cgp-204' },
  { cgp: 'CGP-0198', title: 'Celo Regional Council Season 1', role: 'Co-Author', status: 'REJECTED', date: 'August 2025', description: 'Proposed a decentralized coordination layer across the Celo ecosystem covering four macro-regions: Africa, Europe, LatAm, and Asia. This first version was rejected.', link: 'https://forum.celo.org/t/celo-regional-council-season-1-funding-request', mondoLink: 'https://mondo.celo.org/governance/cgp-198' },
  { cgp: 'CGP-0195', title: 'Celo Communities Guild H2 2025', role: 'Co-Author', status: 'EXECUTED', date: 'July 2025', description: 'Continued Communities Guild funding for July through December 2025, sustaining 24/7 moderation across Discord, Telegram, Reddit, and X.', link: 'https://forum.celo.org/t/celo-communities-guild-season-1-funding-request', mondoLink: 'https://mondo.celo.org/governance/cgp-195' },
  { cgp: 'CGP-0165', title: 'Celo Communities Guild H1 2025', role: 'Co-Author', status: 'EXECUTED', date: 'February 2025', description: 'Funded the Communities Guild to sustain moderation across Discord, Telegram, Reddit, and X throughout H1 2025. The program has been active since August 2021.', link: 'https://forum.celo.org/t/celo-communities-guild-proposal-2025-h1-budget', mondoLink: 'https://mondo.celo.org/governance/cgp-165' },
  // 2024
  { cgp: 'CGP-0153', title: 'CeloColombia DAO', role: 'Advisor', status: 'EXECUTED', date: 'October 2024', description: 'Advised and served as multisig signer for CeloColombia DAO, which received 38,000 cUSD for community building and preparation for the $cCOP stablecoin launch in Colombia.', link: 'https://forum.celo.org/t/celocolombia-dao-funding-and-operations-proposal', mondoLink: 'https://mondo.celo.org/governance/cgp-153' },
  { cgp: 'CGP-0152', title: 'Celo Governance Guild', role: 'Co-Author', status: 'EXECUTED', date: 'October 2024', description: 'Created and funded the Celo Governance Guild (formerly CGP Editors) to handle proposal review, coordination, governance call facilitation, and community engagement.', link: 'https://forum.celo.org/t/creation-of-celo-governance-guild', mondoLink: 'https://mondo.celo.org/governance/cgp-152' },
  { cgp: 'CGP-0132', title: 'Stabila Foundation Funding', role: 'On-chain Submitter', status: 'EXECUTED', date: 'May 2024', description: 'Submitted on-chain a proposal by Kevin Tharayil to fund the Stabila Foundation with 5 million CELO over 12 months to accelerate stablecoin adoption across Africa, Latin America, and Southeast Asia.', link: 'https://forum.celo.org/t/proposal-for-funding-stabila-driving-stablecoin-adoption-on-celo', mondoLink: 'https://mondo.celo.org/governance/cgp-132' },
  { cgp: 'CGP-0126', title: 'Celo Africa H1 2024 Regional DAO', role: 'On-chain Submitter', status: 'EXECUTED', date: 'March 2024', description: 'Submitted on-chain a proposal requesting $248,300 cUSD for Celo Africa DAO operations, covering incubator programs, Web3 talent development, and market awareness across five African countries.', link: 'https://forum.celo.org/t/celo-africa-h1-2024-regional-dao', mondoLink: 'https://mondo.celo.org/governance/cgp-126' },
  { cgp: 'CGP-0125', title: 'Celo India H1 2024 Regional DAO', role: 'On-chain Submitter', status: 'REJECTED', date: 'March 2024', description: 'Submitted on-chain a proposal requesting $46,000 cUSD for the Celo India DAO to support university training programs, community meetups, and regional expansion.', link: 'https://forum.celo.org/t/celo-india-h1-2024-regional-dao', mondoLink: 'https://mondo.celo.org/governance/cgp-125' },
  { cgp: 'CGP-0124', title: 'Celo Thailand DAO H1 2024', role: 'On-chain Submitter', status: 'EXECUTED', date: 'March 2024', description: 'Submitted on-chain a proposal allocating $37,750 cUSD to KohCelo (Celo Thailand DAO) to establish Thailand as a regional hub ahead of Devcon 2024 in Bangkok.', link: 'https://forum.celo.org/t/celo-thailand-dao-h1-2024', mondoLink: 'https://mondo.celo.org/governance/cgp-124' },
  { cgp: 'CGP-0120', title: 'Celo Europe H1 2024 Regional DAO', role: 'Co-Author', status: 'EXECUTED', date: 'February 2024', description: 'Continued Celo Europe DAO into H1 2024 with three pillars: events and community development, business development and investor relationships, and content production.', link: 'https://forum.celo.org/t/celo-europe-h1-2024-regional-dao-final', mondoLink: 'https://mondo.celo.org/governance/cgp-120' },
  // 2023
  { cgp: 'CGP-0111', title: 'Strategic Grant for Accelerating Celo Ecosystem Adoption Across Africa', role: 'On-chain Submitter', status: 'EXECUTED', date: 'December 2023', description: 'Submitted on-chain a proposal allocating $568,182 per quarter to Opera for marketing, business development, and educational content targeting their 100M+ African user base through MiniPay wallet.', link: 'https://forum.celo.org/t/strategic-grant-for-accelerating-celo-ecosystem-adoption-across-africa', mondoLink: 'https://mondo.celo.org/governance/cgp-111' },
  { cgp: 'CGP-0110', title: 'Mentors Collective', role: 'On-chain Submitter', status: 'REJECTED', date: 'December 2023', description: 'Submitted on-chain a proposal by Sharon Sciammas requesting 653,323 CELO for a structured mentorship initiative supporting 30-50 Celo ecosystem projects over six months.', link: 'https://forum.celo.org/t/mentors-collective', mondoLink: 'https://mondo.celo.org/governance/cgp-110' },
  { cgp: 'CGP-0093', title: 'ReFI DAO x CELO', role: 'On-chain Submitter', status: 'REJECTED', date: 'August 2023', description: 'Submitted on-chain a proposal by John Ellison requesting 587,000 CELO for ReFi DAO to build a "ClassPass for Regeneration" product on Celo and host the first "Davos for ReFi" meeting.', link: 'https://forum.celo.org/t/proposal-refi-dao-x-celo-onboarding-the-next-generation-of-talent-and-capital/6243/1', mondoLink: 'https://mondo.celo.org/governance/cgp-93' },
  { cgp: 'CGP-0092', title: 'Mobile First Community in Celo Ecosystem and Telecom', role: 'On-chain Submitter', status: 'EXECUTED', date: 'August 2023', description: 'Submitted on-chain a proposal by Jeff Pulver requesting 120,000 CELO to build a mobile-first community bridging telecom and blockchain through VON conferences, local chapters, and partnerships with major telcos.', link: 'https://forum.celo.org/t/proposal-for-60-000-funding-to-support-a-mobile-first-community-in-celo-ecosystem/6313', mondoLink: 'https://mondo.celo.org/governance/cgp-92' },
  { cgp: 'CGP-0088', title: 'CELO Korea', role: 'On-chain Submitter', status: 'EXECUTED', date: 'July 2023', description: 'Submitted on-chain a proposal requesting $150,000 to establish Celo\'s presence in South Korea through localization, community platforms, and strategic partnerships.', link: 'https://forum.celo.org/t/celo-korea', mondoLink: 'https://mondo.celo.org/governance/cgp-88' },
  { cgp: 'CGP-0082', title: 'Celo Europe DAO Season 0', role: 'Author', status: 'PROPOSED', date: 'June 2023', description: 'Kicked off Celo Europe DAO Season 0, testing community growth through university activities, media exposure, Web3 conferences, hackathons, and institutional events across Europe.', link: 'https://forum.celo.org/t/celo-europe-dao', mondoLink: 'https://mondo.celo.org/governance/cgp-82' },
  { cgp: 'CGP-0076', title: 'LatAm Web3 DAO', role: 'Author', status: 'EXECUTED', date: 'March 2023', description: 'Established the LatAm Web3 DAO to grow the Celo community across Portuguese and Spanish-speaking Latin America, nurturing Web3 initiatives focused on ReFi use cases.', link: 'https://forum.celo.org/t/latam-w3-dao-proposal', mondoLink: 'https://mondo.celo.org/governance/cgp-76' },
  // 2022
  { cgp: 'CGP-0060', title: 'Colombian Peso StableCoin ($cCOP)', role: 'Author', status: 'WITHDRAWN', date: 'August 2022', description: 'Proposed introducing a stablecoin pegged to the Colombian Peso on Celo, leveraging Colombia\'s strong crypto adoption where 6.1% of the population owns crypto and ranks 4th globally for P2P Bitcoin trading.', link: 'https://forum.celo.org/t/proposal-to-introduce-colombian-peso-ccop-stable-coin', mondoLink: 'https://mondo.celo.org/governance/cgp-60' },
]

const statusColors: Record<string, string> = {
  EXECUTED: 'bg-green-500/20 text-green-400',
  PROPOSED: 'bg-blue-500/20 text-blue-400',
  WITHDRAWN: 'bg-gray-500/20 text-gray-400',
  REJECTED: 'bg-red-500/20 text-red-400',
  DRAFT: 'bg-yellow-500/20 text-yellow-400',
}

const ACCENT = '#34d399'

export default function Governance() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  const statuses = useMemo(() => Array.from(new Set(proposals.map((p) => p.status))), [])
  const roles = useMemo(() => Array.from(new Set(proposals.map((p) => p.role))), [])
  const q = query.trim().toLowerCase()
  const filtered = proposals.filter(
    (p) =>
      (!q || [p.cgp, p.title, p.description, p.date].join(' ').toLowerCase().includes(q)) &&
      (!status || p.status === status) &&
      (!role || p.role === role)
  )
  const executed = proposals.filter((p) => p.status === 'EXECUTED').length

  const chip = (active: boolean) =>
    active
      ? { borderColor: ACCENT, background: `${ACCENT}22`, color: '#ffffff' }
      : { borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }
  const chipClass =
    'rounded-full border px-3 py-1 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60'

  return (
    <div>
      <SectionHeader
        kicker="04 / Governance"
        title="Governance"
        intro={`Celo Governance Guardian: overseeing the CGP process, reviewing proposals and facilitating community governance. ${proposals.length} proposals, ${executed} executed.`}
        color={ACCENT}
      />

      <div className="mt-6 space-y-3">
        <label className="relative block">
          <span className="sr-only">Search proposals</span>
          <svg aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by CGP number, title or topic"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-emerald-400/60 focus:outline-none focus:ring-1 focus:ring-emerald-400/40"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {statuses.map((s) => (
            <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(status === s ? null : s)} className={chipClass} style={chip(status === s)}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by role">
          {roles.map((r) => (
            <button key={r} type="button" aria-pressed={role === r} onClick={() => setRole(role === r ? null : r)} className={chipClass} style={chip(role === r)}>
              {r}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500" aria-live="polite">
          {filtered.length} of {proposals.length} proposals
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((proposal) => (
          <article
            key={proposal.cgp}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-white/20"
          >
            <div className="flex flex-wrap items-center gap-2">
              <a href={proposal.mondoLink} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-emerald-400 hover:underline">
                {proposal.cgp}
              </a>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColors[proposal.status] || ''}`}>
                {proposal.status}
              </span>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[11px] text-purple-300">{proposal.role}</span>
              <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.15em] text-gray-500">{proposal.date}</span>
            </div>
            <h3 className="mt-2 font-semibold leading-snug text-white">{proposal.title}</h3>
            {proposal.description && <p className="mt-1.5 text-sm leading-relaxed text-gray-300">{proposal.description}</p>}
            {proposal.link && (
              <a href={proposal.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-blue-300 hover:underline">
                View discussion
              </a>
            )}
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-white/10 p-6 text-center text-sm text-gray-400">No proposals match these filters.</p>
        )}
      </div>

      <a
        href="https://github.com/celo-org/governance"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block text-sm text-blue-300 hover:underline"
      >
        View full governance repository
      </a>
    </div>
  )
}
