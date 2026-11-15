'use client'

import { motion } from 'framer-motion'
import { upcomingEvents, type UpcomingEvent } from '@/data/upcomingEvents'

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
  const start = parseDate(event.start)
  const end = parseDate(event.end)
  for (let t = start.getTime(); t <= end.getTime(); t += DAY_MS) {
    const d = new Date(t)
    if (d.getFullYear() === year && d.getMonth() === month) days.add(d.getDate())
  }
  return days
}

function monthAnchor(key: number) {
  const { year, month } = keyToYearMonth(key)
  return `events-${year}-${month + 1}`
}

function scrollToMonth(key: number) {
  document.getElementById(monthAnchor(key))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Badges({ event, now }: { event: UpcomingEvent; now: number }) {
  const deadlineSoon =
    event.deadline !== undefined &&
    endOfDay(event.deadline) >= now &&
    endOfDay(event.deadline) - now <= 30 * DAY_MS
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-gray-300">
          {event.kind}
        </span>
        {event.featured && (
          <span className="rounded-full bg-amber-300/15 px-2 py-0.5 text-xs text-amber-200">
            Major event
          </span>
        )}
        {event.applicationsOpen && (
          <span className="rounded-full bg-green-400/15 px-2 py-0.5 text-xs text-green-300">
            Applications open
          </span>
        )}
      </div>
      {event.deadlineLabel && (
        <p className={`mt-2 text-sm ${deadlineSoon ? 'font-semibold text-amber-300' : 'text-gray-400'}`}>
          {event.deadlineLabel}
        </p>
      )}
    </>
  )
}

function Links({ event }: { event: UpcomingEvent }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {event.links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            link.primary
              ? 'rounded-md bg-green-500/20 px-3 py-1 text-sm text-green-200 transition-colors hover:bg-green-500/30'
              : 'px-1 py-1 text-sm text-blue-400 hover:underline'
          }
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

function EventCard({ event, now }: { event: UpcomingEvent; now: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-lg border p-4 ${event.featured ? 'border-amber-300/30 bg-amber-300/5' : 'border-white/10 bg-white/[0.02]'}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h4 className="text-lg font-semibold text-white">{event.name}</h4>
        <span className="text-sm text-gray-400">{event.dateLabel}</span>
      </div>
      <p className="mb-2 text-sm text-gray-500">{event.location}</p>
      <Badges event={event} now={now} />
      <p className="mt-2 text-sm text-gray-300">{event.description}</p>
      <Links event={event} />
    </motion.div>
  )
}

function MonthGrid({
  year,
  month,
  events,
  today,
}: {
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
          <div
            key={day}
            className={`rounded py-1 ${cls} ${isToday ? 'ring-1 ring-white/70' : ''}`}
          >
            {day}
          </div>
        )
      })}
    </div>
  )
}

export default function UpcomingEvents() {
  const nowDate = new Date()
  const now = nowDate.getTime()
  const currentKey = monthKey(nowDate)

  const active = upcomingEvents.filter((e) => isUpcoming(e, now))
  const featured = active.filter((e) => e.featured).sort(sortByStart)
  const dated = active.filter((e) => e.start).sort(sortByStart)
  const rolling = active.filter((e) => !e.start)

  // Each dated event is listed once, in its start month (or the current month if already running).
  const byMonth = new Map<number, UpcomingEvent[]>()
  // Every month an event touches, so grids can highlight spans across months.
  const touching = new Map<number, UpcomingEvent[]>()
  let lastKey = currentKey
  for (const event of dated) {
    const startKey = Math.max(monthKey(parseDate(event.start!)), currentKey)
    const endKey = monthKey(parseDate(event.end ?? event.start!))
    byMonth.set(startKey, [...(byMonth.get(startKey) ?? []), event])
    for (let k = startKey; k <= endKey; k++) {
      touching.set(k, [...(touching.get(k) ?? []), event])
    }
    lastKey = Math.max(lastKey, endKey)
  }

  const monthKeys: number[] = []
  for (let k = currentKey; k <= lastKey; k++) monthKeys.push(k)
  const monthsWithEvents = monthKeys.filter((k) => byMonth.has(k) || touching.has(k))

  return (
    <section className="bg-black py-6">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Upcoming Events
        </motion.h2>
        <p className="mt-3 text-gray-400">
          Events, hackathons, grants and calls for speakers I am following, with links to apply.
        </p>

        {featured.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200/80">Major events</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {featured.map((event) => (
                <a
                  key={event.name}
                  href={event.links.find((l) => l.primary)?.url ?? event.links[0]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-amber-300/30 bg-amber-300/5 p-3 transition-colors hover:bg-amber-300/10"
                >
                  <p className="font-semibold text-white">{event.name}</p>
                  <p className="text-sm text-amber-200">{event.dateLabel}</p>
                  <p className="text-xs text-gray-400">{event.location}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-green-300/80">Calendar</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {monthKeys.map((k) => {
              const { year, month } = keyToYearMonth(k)
              const has = byMonth.has(k) || touching.has(k)
              const hasFeatured = (touching.get(k) ?? []).some((e) => e.featured)
              return (
                <button
                  key={k}
                  type="button"
                  disabled={!has}
                  onClick={() => scrollToMonth(k)}
                  className={`rounded-md px-2 py-1 text-xs transition-colors ${
                    !has
                      ? 'cursor-default text-gray-600'
                      : hasFeatured
                        ? 'bg-amber-300/15 text-amber-200 hover:bg-amber-300/25'
                        : 'bg-green-400/10 text-green-200 hover:bg-green-400/20'
                  }`}
                >
                  {MONTHS[month]} {String(year).slice(2)}
                </button>
              )
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-amber-300/80" /> Major event</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-green-400/30" /> Other event</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded ring-1 ring-white/70" /> Today</span>
          </div>
        </div>

        {monthsWithEvents.map((k) => {
          const { year, month } = keyToYearMonth(k)
          const listed = byMonth.get(k) ?? []
          const continuing = (touching.get(k) ?? []).filter((e) => !listed.includes(e))
          return (
            <div key={k} id={monthAnchor(k)} className="mt-10 scroll-mt-4">
              <h3 className="text-xl font-bold text-white">
                {MONTHS_LONG[month]} {year}
              </h3>
              <div className="mt-4 rounded-lg border border-white/10 p-3">
                <MonthGrid year={year} month={month} events={touching.get(k) ?? []} today={nowDate} />
              </div>
              {continuing.length > 0 && (
                <p className="mt-3 text-sm text-gray-400">
                  Continues this month: {continuing.map((e) => e.name).join(', ')}
                </p>
              )}
              {listed.length > 0 && (
                <div className="mt-4 space-y-3">
                  {listed.map((event) => (
                    <EventCard key={event.name} event={event} now={now} />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {rolling.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-white">Rolling / no fixed date</h3>
            <div className="mt-4 space-y-3">
              {rolling.map((event) => (
                <EventCard key={event.name} event={event} now={now} />
              ))}
            </div>
          </div>
        )}

        {active.length === 0 && (
          <p className="mt-12 text-gray-400">Nothing scheduled right now. Check back soon.</p>
        )}
      </div>
    </section>
  )
}
