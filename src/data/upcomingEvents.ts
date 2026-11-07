export type EventKind =
  | 'Conference'
  | 'Hackathon'
  | 'Grant'
  | 'Program'
  | 'Pop-up city'
  | 'Call for speakers'
  | 'Networking'

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
  // Application or registration deadline, if any.
  deadline?: string
  deadlineLabel?: string
  applicationsOpen?: boolean
  description: string
  links: EventLink[]
}

// Last reviewed: 2026-11-07. Source of truth: dashboards/events.md on the VPS.
export const upcomingEvents: UpcomingEvent[] = [
  {
    name: 'Codigo Cordillera',
    kind: 'Hackathon',
    location: 'Online',
    dateLabel: 'Nov 6-8, 2026',
    start: '2026-11-06',
    end: '2026-11-08',
    description: '48-hour online hackathon on Stellar, organized by BAF and born in Colombia.',
    links: [
      { label: 'Event page', url: 'https://www.thebafnetwork.com/hackathons/co/codigo-cordillera', primary: true },
    ],
  },
  {
    name: 'GoodBuilders Season 5',
    kind: 'Program',
    location: 'Online (Celo)',
    dateLabel: 'Kickoff Nov 9, 2026',
    start: '2026-11-09',
    end: '2026-11-09',
    applicationsOpen: true,
    description: 'USD 50K+ in G$ streamed over about 3 months for teams building on Celo, with mentorship, weekly 1:1s and Demo Days. Open to new and returning teams.',
    links: [
      { label: 'Apply', url: 'https://ubi.gd/gbuilders5', primary: true },
      { label: 'Become a mentor', url: 'https://ubi.gd/mentors' },
    ],
  },
  {
    name: 'DAS Week networking',
    kind: 'Networking',
    location: 'London, UK',
    dateLabel: 'Nov 11, 2026',
    start: '2026-11-11',
    end: '2026-11-11',
    description: 'Evening networking for digital asset and AI operators and investors during Digital Asset Summit week.',
    links: [
      { label: 'Register', url: 'https://luma.com/j6gxeshu', primary: true },
    ],
  },
  {
    name: 'American Fintech Council side event',
    kind: 'Call for speakers',
    location: 'Washington D.C., USA',
    dateLabel: 'Nov 16, 2026',
    start: '2026-11-16',
    end: '2026-11-16',
    applicationsOpen: true,
    description: 'Side event during the American Fintech Council week. Organizers are looking for speakers and sponsors.',
    links: [
      { label: 'Event page', url: 'https://luma.com/6yihjk9j', primary: true },
    ],
  },
  {
    name: 'Instawards LATAM (November cohort)',
    kind: 'Grant',
    location: 'Online (Stellar)',
    dateLabel: 'November 2026',
    start: '2026-11-01',
    end: '2026-11-30',
    applicationsOpen: true,
    description: 'BAF and Stellar fund 30-day sprints with up to USD 5,000 in XLM for teams building on Stellar.',
    links: [
      { label: 'Apply', url: 'https://instawards.netlify.app/', primary: true },
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
    name: 'Blockchain Life 2026',
    kind: 'Conference',
    location: 'Dubai, UAE',
    dateLabel: 'Dec 1-2, 2026',
    start: '2026-12-01',
    end: '2026-12-02',
    description: '17th edition of the forum at Festival Arena, with 100+ side events from Nov 27 to Dec 6.',
    links: [
      { label: 'Official site', url: 'https://blockchain-life.com/', primary: true },
    ],
  },
  {
    name: 'Proof of Talk Abu Dhabi',
    kind: 'Conference',
    location: 'Louvre Abu Dhabi, UAE',
    dateLabel: 'Dec 3-4, 2026',
    start: '2026-12-03',
    end: '2026-12-04',
    deadline: '2026-11-22',
    deadlineLabel: 'Applications close Nov 22',
    applicationsOpen: true,
    description: 'Executive summit on digital assets and AI. Attendance is by curated application only. Includes StableDay on Dec 3.',
    links: [
      { label: 'Apply to attend', url: 'https://proofoftalk.io/abu-dhabi/', primary: true },
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
    name: 'HSC Asset Management',
    kind: 'Conference',
    location: 'Abu Dhabi, UAE',
    dateLabel: 'Dec 9-10, 2026',
    start: '2026-12-09',
    end: '2026-12-10',
    description: 'Asset management event during Abu Dhabi Finance Week.',
    links: [
      { label: 'Event page', url: 'https://luma.com/HSC_Abu_Dhabi', primary: true },
    ],
  },
  {
    name: 'Prezenti Grants Season 3',
    kind: 'Grant',
    location: 'Online (Celo)',
    dateLabel: 'Open until Dec 29, 2026',
    start: '2026-08-12',
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
    name: 'ETH Lima Builders Series',
    kind: 'Call for speakers',
    location: 'Online',
    dateLabel: 'Rolling',
    applicationsOpen: true,
    description: 'Ethereum Lima is looking for speakers on Ethereum, Web3, AI and emerging tech for its Builders Series.',
    links: [
      { label: 'Apply to speak', url: 'https://tally.so/r/ODJBxp', primary: true },
      { label: 'Series page', url: 'https://www.ethlima.org/es/events/builder-series' },
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
  {
    name: 'EthCC[10]',
    kind: 'Conference',
    location: 'Palais des Festivals, Cannes, France',
    dateLabel: 'Apr 12-15, 2027',
    start: '2027-04-12',
    end: '2027-04-15',
    deadline: '2027-01-31',
    deadlineLabel: 'Full Pass 590 EUR until Jan 31, then 750 EUR',
    applicationsOpen: true,
    description: 'Tenth edition of the Ethereum Community Conference. Speaker applications are open.',
    links: [
      { label: 'Apply to speak', url: 'https://ethcc.io/forms/speakers', primary: true },
      { label: 'Tickets', url: 'https://ethcc.io/tickets' },
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
    description: 'Three days fully focused on the hackathon and builders, exploring Ethereum and AI. Subscribe to get notified when applications open.',
    links: [
      { label: 'Newsletter', url: 'https://ethprague.com', primary: true },
    ],
  },
  {
    name: 'Devcon 9',
    kind: 'Conference',
    location: 'Lisbon, Portugal',
    dateLabel: 'Oct 11-13, 2027',
    start: '2027-10-11',
    end: '2027-10-13',
    description: 'The Ethereum Foundation developer conference comes to Lisbon. Venue, tickets and CFP not announced yet.',
    links: [
      { label: 'Official site', url: 'https://devcon.org', primary: true },
      { label: 'Announcement', url: 'https://x.com/efdevcon/status/2118664094819782946' },
    ],
  },
  {
    name: 'Stable Summit IV',
    kind: 'Call for speakers',
    location: 'London, UK',
    dateLabel: 'Date TBA',
    applicationsOpen: true,
    description: 'Stablecoin-focused summit. Speaker applications are open.',
    links: [
      { label: 'Apply to speak', url: 'https://dash.agendaforge.app/submit/stable-summit-iv-london/speaker-application-form-stable-summit-iv-london', primary: true },
      { label: 'Speakers page', url: 'https://www.stablesummit.xyz/speakers' },
    ],
  },
  {
    name: 'ETHDenver 2027',
    kind: 'Conference',
    location: 'Denver, USA',
    dateLabel: 'Not announced yet',
    description: 'No official dates yet. The 2026 edition ran Feb 17-21.',
    links: [
      { label: 'Official site', url: 'https://ethdenver.com', primary: true },
    ],
  },
]
