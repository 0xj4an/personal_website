export type EventKind =
  | 'Conference'
  | 'Hackathon'
  | 'Grant'
  | 'Program'
  | 'Pop-up city'
  | 'Call for speakers'
  | 'Course'
  | 'Community call'

export interface EventLink {
  label: string
  url: string
  primary?: boolean
}

export interface UpcomingEvent {
  name: string
  kind: EventKind
  location: string
  dateLabel: string
  // ISO dates (YYYY-MM-DD). Omit for events without confirmed dates.
  start?: string
  end?: string
  // True when only the month is known (start/end span the whole month).
  monthOnly?: boolean
  // Major events on the watchlist, shown first.
  featured?: boolean
  deadline?: string
  deadlineLabel?: string
  applicationsOpen?: boolean
  description: string
  links: EventLink[]
}

// Last reviewed: 2026-11-16. Source of truth: dashboards/events.md on the VPS.
// Only public events with official links. No rumors, no internal deadlines.
export const upcomingEvents: UpcomingEvent[] = [
  // Major events (watchlist)
  {
    name: 'ETHDenver 10',
    kind: 'Conference',
    location: 'Denver, USA',
    dateLabel: 'Mar 24-25, 2027',
    start: '2027-03-24',
    end: '2027-03-25',
    featured: true,
    description: 'Tenth edition of ETHDenver. Venue and registration details coming soon.',
    links: [
      { label: 'Official site', url: 'https://ethdenver.com', primary: true },
    ],
  },
  {
    name: 'EthCC[10]',
    kind: 'Conference',
    location: 'Palais des Festivals, Cannes, France',
    dateLabel: 'Apr 12-15, 2027',
    start: '2027-04-12',
    end: '2027-04-15',
    featured: true,
    deadline: '2027-01-31',
    deadlineLabel: 'Full Pass 590 EUR until Jan 31, then 750 EUR',
    applicationsOpen: true,
    description: 'Tenth edition of the Ethereum Community Conference. Speaker applications are open. Topics include decentralization, tokenization, privacy, regulation, infrastructure, responsible AI and institutional adoption.',
    links: [
      { label: 'Apply to speak', url: 'https://ethcc.io/forms/speakers', primary: true },
      { label: 'Tickets', url: 'https://ethcc.io/tickets' },
      { label: 'Volunteer / student access', url: 'https://ethcc.io/tickets#community' },
      { label: 'Official site', url: 'https://ethcc.io' },
    ],
  },
  {
    name: 'ETHCluj 2027',
    kind: 'Conference',
    location: 'Cluj-Napoca, Romania',
    dateLabel: 'May 2027 (exact dates TBA)',
    start: '2027-05-01',
    end: '2027-05-31',
    monthOnly: true,
    featured: true,
    description: 'Third edition of "Ethereum for Everyone". Dates, CFP and tickets not announced yet.',
    links: [
      { label: 'Official site', url: 'https://ethcluj.org', primary: true },
    ],
  },
  {
    name: 'ETHPrague 2027',
    kind: 'Hackathon',
    location: 'Prague, Czechia',
    dateLabel: 'May 28-30, 2027',
    start: '2027-05-28',
    end: '2027-05-30',
    featured: true,
    description: 'Three days fully focused on the hackathon and builders, exploring Ethereum and AI. Subscribe to get notified when applications open.',
    links: [
      { label: 'Newsletter', url: 'https://ethprague.com', primary: true },
    ],
  },
  {
    name: 'Devcon 9',
    kind: 'Conference',
    location: 'CCL Lisbon Congress Centre, Portugal',
    dateLabel: 'Oct 12-14, 2027',
    start: '2027-10-12',
    end: '2027-10-14',
    featured: true,
    description: 'The Ethereum Foundation developer conference comes to Lisbon. Tickets, CFP and scholarships not announced yet. Join the waitlist.',
    links: [
      { label: 'Join waitlist', url: 'https://devcon.org/lisbon/', primary: true },
      { label: 'Official site', url: 'https://devcon.org' },
    ],
  },

  // Other events and opportunities
  {
    name: 'Solana Breakpoint 2026',
    kind: 'Conference',
    location: 'London, UK',
    dateLabel: 'Nov 15-17, 2026',
    start: '2026-11-15',
    end: '2026-11-17',
    description: 'Solana Breakpoint plus 100+ side events around it.',
    links: [
      { label: 'Side events', url: 'https://miragather.com/Breakpoint2026SideEvents2026', primary: true },
    ],
  },
  {
    name: 'Codigo 402',
    kind: 'Course',
    location: 'Online (Spanish)',
    dateLabel: 'Nov 10-27, 2026',
    start: '2026-11-10',
    end: '2026-11-27',
    applicationsOpen: true,
    description: 'Free 5-session course plus Demo Day by BAF Mexico, Stellar Ambassador Program and Nirium. Build an x402 API and an agent that pays on its own.',
    links: [
      { label: 'Register', url: 'https://luma.com/ljzvwv35', primary: true },
    ],
  },
  {
    name: 'DeCompute',
    kind: 'Conference',
    location: 'Singapore',
    dateLabel: 'Nov 18, 2026',
    start: '2026-11-18',
    end: '2026-11-18',
    description: 'One day on privacy, fraud and AML, and agentic AI, during Singapore FinTech Festival week.',
    links: [
      { label: 'Register', url: 'https://luma.com/decompute-tc6t', primary: true },
    ],
  },
  {
    name: 'ETH Lima Builders Series: De la idea a la dApp',
    kind: 'Call for speakers',
    location: 'Online',
    dateLabel: 'Nov 21, 2026 (CFP rolling)',
    start: '2026-11-21',
    end: '2026-11-21',
    applicationsOpen: true,
    description: 'Virtual session of the ETH Lima Builders Series. The series keeps a rolling call for speakers on Ethereum, Web3 and AI.',
    links: [
      { label: 'Apply to speak', url: 'https://tally.so/r/ODJBxp', primary: true },
      { label: 'Join the session', url: 'https://luma.com/jv3l3a24' },
      { label: 'Series page', url: 'https://www.ethlima.org/es/events/builder-series' },
    ],
  },
  {
    name: 'BNB Chain Build, Demo and Pitch',
    kind: 'Hackathon',
    location: 'Bangkok, Thailand',
    dateLabel: 'Nov 25-27, 2026',
    start: '2026-11-25',
    end: '2026-11-27',
    applicationsOpen: true,
    description: '36-hour hackathon around Binance Blockchain Week. AI, trading and RWA tracks, USD 100K+ in prizes.',
    links: [
      { label: 'Details', url: 'https://www.bnbchain.org/en/blog/bnb-bangkok-build-demo-and-pitch', primary: true },
    ],
  },
  {
    name: 'Aleph Rosario',
    kind: 'Conference',
    location: 'Rosario, Argentina',
    dateLabel: 'Nov 27-28, 2026',
    start: '2026-11-27',
    end: '2026-11-28',
    description: 'Crecimiento brings Aleph to Rosario.',
    links: [
      { label: 'Announcement', url: 'https://x.com/crecimientoar/status/2115187011225375000', primary: true },
    ],
  },
  {
    name: 'Instawards LATAM (November cohort)',
    kind: 'Grant',
    location: 'Online (Stellar)',
    dateLabel: 'November 2026',
    start: '2026-11-01',
    end: '2026-11-30',
    monthOnly: true,
    applicationsOpen: true,
    description: 'BAF and Stellar fund 30-day sprints with up to USD 5,000 in XLM for teams building on Stellar.',
    links: [
      { label: 'Apply', url: 'https://instawards.netlify.app/', primary: true },
    ],
  },
  {
    name: 'Blockchain Life 2026',
    kind: 'Conference',
    location: 'Dubai, UAE',
    dateLabel: 'Dec 1-2, 2026',
    start: '2026-12-01',
    end: '2026-12-02',
    description: '17th edition at Festival Arena, with 100+ side events from Nov 27 to Dec 6.',
    links: [
      { label: 'Official site', url: 'https://blockchain-life.com/', primary: true },
    ],
  },
  {
    name: 'Abu Dhabi Finance Week',
    kind: 'Conference',
    location: 'Al Maryah Island, Abu Dhabi, UAE',
    dateLabel: 'Dec 7-10, 2026',
    start: '2026-12-07',
    end: '2026-12-10',
    description: 'Fifth edition hosted by ADGM, with 70+ events covering capital markets, fintech and digital assets.',
    links: [
      { label: 'Official site', url: 'https://www.adfw.com/', primary: true },
    ],
  },
  {
    name: 'HSC Asset Management Conference',
    kind: 'Conference',
    location: 'Abu Dhabi, UAE',
    dateLabel: 'Dec 9, 2026',
    start: '2026-12-09',
    end: '2026-12-09',
    description: 'Asset management conference during Abu Dhabi Finance Week.',
    links: [
      { label: 'Register', url: 'https://luma.com/HSC_Abu_Dhabi', primary: true },
    ],
  },
  {
    name: 'ReFi DAO year-end network check-in',
    kind: 'Community call',
    location: 'Online',
    dateLabel: 'Dec 9, 2026',
    start: '2026-12-09',
    end: '2026-12-09',
    description: '2026 recap and where ReFi DAO is heading in 2027, with the local node network.',
    links: [
      { label: 'Register', url: 'https://luma.com/qc0hv9de', primary: true },
    ],
  },
  {
    name: 'Prezenti Grants Season 3',
    kind: 'Grant',
    location: 'Online (Celo)',
    dateLabel: 'Open until Dec 29, 2026',
    start: '2026-12-29',
    end: '2026-12-29',
    deadline: '2026-12-29',
    deadlineLabel: 'Applications close Dec 29',
    applicationsOpen: true,
    description: 'Celo ecosystem grants. Frontier pool for AI and agent infrastructure, Anchor pool for scaling proven products on Celo.',
    links: [
      { label: 'Apply to Frontier', url: 'https://frontier.prezenti.xyz', primary: true },
      { label: 'Apply to Anchor', url: 'https://anchor.prezenti.xyz' },
      { label: 'Program details', url: 'https://forum.celo.org/t/prezenti-season-3-is-open-frontier-anchor-and-boost-grants-for-celo/13714' },
    ],
  },
  {
    name: 'masa madre',
    kind: 'Pop-up city',
    location: 'Buenos Aires, Argentina',
    dateLabel: 'Late Mar to mid Apr, 2027',
    start: '2027-03-20',
    end: '2027-04-15',
    applicationsOpen: true,
    description: 'One-month pop-up city for interdisciplinary, international builders. Open call.',
    links: [
      { label: 'Manifesto', url: 'https://airy-marlin-b52.notion.site/masa-madre-manifesto-3eb0645334a7806fb143e6ccc4736aec', primary: true },
    ],
  },

  // Rolling, no fixed date
  {
    name: 'Arbitrum Mentorship Program, Cohort 2',
    kind: 'Program',
    location: 'Online',
    dateLabel: 'Rolling, limited spots',
    applicationsOpen: true,
    description: '12-week mentorship for teams building on Arbitrum One and Robinhood Chain: product, GTM, growth, fundraising.',
    links: [
      { label: 'Apply', url: 'https://tally.so/r/Xx6xqO', primary: true },
    ],
  },
  {
    name: 'Mozilla Foundation Human-Scale AI incubator',
    kind: 'Grant',
    location: 'Online',
    dateLabel: 'Call for proposals',
    applicationsOpen: true,
    description: 'Mozilla Foundation incubator call for human-scale AI projects.',
    links: [
      { label: 'Call for proposals', url: 'https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/human-scale-ai/call-for-proposals/', primary: true },
    ],
  },
]
