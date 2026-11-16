'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { upcomingEvents, type EventKind, type UpcomingEvent } from '@/data/upcomingEvents'
import SectionHeader from './SectionHeader'

const ACCENT = '#4ade80'
const DAY_MS = 24 * 60 * 60 * 1000
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function endOfDay(iso: string) {
  return parseDate(iso).getTime() + DAY_MS - 1
}

function monthKey(date: Date) {
  return date.getFullYear() * 12 + date.getMonth()
}

function keyToYearMonth(key: number) {
  return { year: Math.floor(key / 12), month: key % 12 }
}

function isUpcoming(event: UpcomingEvent, now: number) {
  if (!event.end) return true
  return endOfDay(event.end) >= now
}

function sortByStart(a: UpcomingEvent, b: UpcomingEvent) {
  return (a.start ?? '').localeCompare(b.start ?? '')
}

function eventDaysInMonth(event: UpcomingEvent, year: number, month: number) {
  const days = new Set<number>()
  if (!event.start || !event.end || event.monthOnly) return days
  // Step by calendar day (not 24h) so DST changes never skip or repeat a day.
  const cursor = parseDate(event.start)
  const end = parseDate(event.end)
  while (cursor <= end) {
    if (cursor.getFullYear() === year && cursor.getMonth() === month) days.add(cursor.getDate())
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function matchesQuery(event: UpcomingEvent, query: string) {
  if (!query) return true
  return [event.name, event.location, event.description, event.kind, event.dateLabel]
    .join(' ')
    .toLowerCase()
    .includes(query)
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function DateBlock({ event }: { event: UpcomingEvent }) {
  let top = 'TBA'
  let bottom = ''
  if (event.start) {
    const start = parseDate(event.start)
    const end = event.end ? parseDate(event.end) : start
    top = MONTHS[start.getMonth()]
    if (event.monthOnly) {
      // Only the month is known; a year here would read as a day ("NOV 26").
      bottom = 'TBA'
    } else if (start.getTime() === end.getTime()) {
      bottom = String(start.getDate())
    } else if (start.getMonth() === end.getMonth()) {
      bottom = `${start.getDate()}-${end.getDate()}`
    } else {
      bottom = `${start.getDate()}+`
    }
  }
  return (
    <div
      className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg border py-2"
      style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0d` }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
        {top}
      </span>
      {bottom && <span className="mt-0.5 text-base font-semibold leading-none text-white">{bottom}</span>}
    </div>
  )
}

function EventRow({ event, now }: { event: UpcomingEvent; now: number }) {
  const deadlineSoon =
    event.deadline !== undefined &&
    endOfDay(event.deadline) >= now &&
    endOfDay(event.deadline) - now <= 30 * DAY_MS
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 rounded-xl border p-4 transition-colors hover:border-white/20"
      style={{
        borderColor: event.featured ? 'rgba(252, 211, 77, 0.3)' : 'rgba(255,255,255,0.08)',
        background: event.featured ? 'rgba(252, 211, 77, 0.04)' : 'rgba(255,255,255,0.02)',
      }}
    >
      <DateBlock event={event} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h4 className="font-semibold text-white">{event.name}</h4>
          {event.featured && (
            <span className="rounded-full bg-amber-300/15 px-2 py-0.5 text-[11px] text-amber-200">Major</span>
          )}
          {event.applicationsOpen && (
            <span className="rounded-full bg-green-400/15 px-2 py-0.5 text-[11px] text-green-300">Applications open</span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-500">
          {event.kind} | {event.location} | {event.dateLabel}
        </p>
        {event.deadlineLabel && (
          <p className={`mt-1.5 text-xs ${deadlineSoon ? 'font-semibold text-amber-300' : 'text-gray-400'}`}>
            {event.deadlineLabel}
          </p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-gray-300">{event.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {event.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                link.primary
                  ? 'rounded-md bg-green-500/20 px-3 py-1 text-xs font-medium text-green-200 transition-colors hover:bg-green-500/30'
                  : 'rounded-md border border-white/10 px-3 py-1 text-xs text-gray-300 transition-colors hover:border-white/25 hover:text-white'
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

function MonthGrid({ year, month, events, today }: {
  year: number
  month: number
  events: UpcomingEvent[]
  today: Date
}) {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const featuredDays = new Set<number>()
  const otherDays = new Set<number>()
  for (const event of events) {
    for (const d of eventDaysInMonth(event, year, month)) {
      if (event.featured) featuredDays.add(d)
      else otherDays.add(d)
    }
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month

  return (
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {WEEKDAYS.map((w) => (
        <div key={w} className="py-1 text-gray-500">{w}</div>
      ))}
      {cells.map((day, i) => {
        if (day === null) return <div key={`blank-${i}`} />
        const featured = featuredDays.has(day)
        const other = otherDays.has(day)
        const isToday = isThisMonth && today.getDate() === day
        const cls = featured
          ? 'bg-amber-300/80 text-black font-bold'
          : other
            ? 'bg-green-400/30 text-green-100 font-semibold'
            : 'text-gray-500'
        return (
          <div key={day} className={`rounded py-1 ${cls} ${isToday ? 'ring-1 ring-white/70' : ''}`}>
            {day}
          </div>
        )
      })}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      style={
        active
          ? { borderColor: ACCENT, background: `${ACCENT}22`, color: '#ffffff' }
          : { borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)' }
      }
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function UpcomingEvents() {
  // Dates depend on the viewer's clock, so render only after mount to avoid hydration mismatches.
  const [nowDate, setNowDate] = useState<Date | null>(null)
  const [query, setQuery] = useState('')
  const [kinds, setKinds] = useState<EventKind[]>([])
  const [openOnly, setOpenOnly] = useState(false)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  useEffect(() => setNowDate(new Date()), [])

  const allKinds = useMemo(
    () => Array.from(new Set(upcomingEvents.map((e) => e.kind))),
    []
  )

  if (!nowDate) {
    return <p className="py-6 text-sm text-gray-400">Loading events...</p>
  }

  const now = nowDate.getTime()
  const currentKey = monthKey(nowDate)
  const q = query.trim().toLowerCase()

  const active = upcomingEvents.filter((e) => isUpcoming(e, now))
  const filtered = active
    .filter((e) => matchesQuery(e, q))
    .filter((e) => kinds.length === 0 || kinds.includes(e.kind))
    .filter((e) => !openOnly || e.applicationsOpen)
  const dated = filtered.filter((e) => e.start).sort(sortByStart)
  const rolling = filtered.filter((e) => !e.start)
  const hasFilters = q !== '' || kinds.length > 0 || openOnly

  // Each dated event is listed once, in its start month (or the current month if already running).
  const byMonth = new Map<number, UpcomingEvent[]>()
  // Every month an event touches, so calendar grids can highlight spans across months.
  const touching = new Map<number, UpcomingEvent[]>()
  for (const event of dated) {
    const startKey = Math.max(monthKey(parseDate(event.start!)), currentKey)
    const endKey = monthKey(parseDate(event.end ?? event.start!))
    byMonth.set(startKey, [...(byMonth.get(startKey) ?? []), event])
    for (let k = startKey; k <= endKey; k++) {
      touching.set(k, [...(touching.get(k) ?? []), event])
    }
  }
  const listMonths = Array.from(byMonth.keys()).sort((a, b) => a - b)
  const calendarMonths = Array.from(touching.keys()).sort((a, b) => a - b)

  const toggleKind = (kind: EventKind) =>
    setKinds((prev) => (prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]))
  const clearFilters = () => {
    setQuery('')
    setKinds([])
    setOpenOnly(false)
  }

  return (
    <div>
      <SectionHeader
        kicker="Watchlist"
        title="Upcoming events"
        intro="Conferences, hackathons, grants and calls for speakers I am following, with links to apply."
        color={ACCENT}
      />

      {/* Search and filters */}
      <div className="mt-6 space-y-3">
        <label className="relative block">
          <span className="sr-only">Search events</span>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city or topic"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-green-400/60 focus:outline-none focus:ring-1 focus:ring-green-400/40"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {allKinds.map((kind) => (
            <Chip key={kind} active={kinds.includes(kind)} onClick={() => toggleKind(kind)}>
              {kind}
            </Chip>
          ))}
          <Chip active={openOnly} onClick={() => setOpenOnly((v) => !v)}>
            Applications open
          </Chip>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500" aria-live="polite">
            {filtered.length} of {active.length} events
            {hasFilters && (
              <>
                {' '}
                <button type="button" onClick={clearFilters} className="text-green-300 underline-offset-2 hover:underline">
                  Clear
                </button>
              </>
            )}
          </p>
          <div className="flex rounded-lg border border-white/10 p-0.5" role="group" aria-label="View">
            {(['list', 'calendar'] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1 text-xs capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                  view === v ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-xl border border-white/10 p-6 text-center text-sm text-gray-400">
          {active.length === 0 ? 'Nothing scheduled right now. Check back soon.' : 'No events match these filters.'}
        </div>
      )}

      {view === 'list' && (
        <>
          {listMonths.map((k) => {
            const { year, month } = keyToYearMonth(k)
            return (
              <section key={k} className="mt-8">
                <h3 className="sticky top-0 z-10 -mx-1 bg-[rgba(10,10,10,0.92)] px-1 py-2 font-mono text-xs uppercase tracking-[0.25em] text-gray-400 backdrop-blur">
                  {MONTHS_LONG[month]} {year}
                </h3>
                <div className="mt-2 space-y-3">
                  {byMonth.get(k)!.map((event) => (
                    <EventRow key={event.name} event={event} now={now} />
                  ))}
                </div>
              </section>
            )
          })}
          {rolling.length > 0 && (
            <section className="mt-8">
              <h3 className="py-2 font-mono text-xs uppercase tracking-[0.25em] text-gray-400">Rolling / no fixed date</h3>
              <div className="mt-2 space-y-3">
                {rolling.map((event) => (
                  <EventRow key={event.name} event={event} now={now} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {view === 'calendar' && filtered.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-amber-300/80" /> Major event</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-green-400/30" /> Other event</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded ring-1 ring-white/70" /> Today</span>
          </div>
          {calendarMonths.map((k) => {
            const { year, month } = keyToYearMonth(k)
            const events = touching.get(k) ?? []
            return (
              <section key={k} className="mt-6">
                <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-gray-400">
                  {MONTHS_LONG[month]} {year}
                </h3>
                <div className="mt-3 rounded-xl border border-white/10 p-3">
                  <MonthGrid year={year} month={month} events={events} today={nowDate} />
                </div>
                <ul className="mt-2 space-y-1 text-xs text-gray-400">
                  {events.map((e) => (
                    <li key={e.name}>
                      <span className={e.featured ? 'text-amber-200' : 'text-green-200'}>{e.dateLabel}</span>
                      {'  '}
                      {e.name}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
          {rolling.length > 0 && (
            <p className="mt-6 text-xs text-gray-500">
              Plus {rolling.length} without fixed dates (see List).
            </p>
          )}
        </>
      )}
    </div>
  )
}
