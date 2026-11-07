'use client'

import { motion } from 'framer-motion'
import { upcomingEvents, type UpcomingEvent } from '@/data/upcomingEvents'

const DAY_MS = 24 * 60 * 60 * 1000

function toTime(iso: string) {
  return new Date(`${iso}T23:59:59`).getTime()
}

function isUpcoming(event: UpcomingEvent, now: number) {
  if (!event.end) return true
  return toTime(event.end) >= now
}

function groupLabel(event: UpcomingEvent) {
  return event.start ? event.start.slice(0, 4) : 'Date TBA'
}

function sortEvents(a: UpcomingEvent, b: UpcomingEvent) {
  if (a.start && b.start) return a.start.localeCompare(b.start)
  if (a.start) return -1
  if (b.start) return 1
  return a.name.localeCompare(b.name)
}

function EventCard({ event, index, now }: { event: UpcomingEvent; index: number; now: number }) {
  const deadlineSoon =
    event.deadline !== undefined &&
    toTime(event.deadline) >= now &&
    toTime(event.deadline) - now <= 30 * DAY_MS

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.4) }}
      className="relative pl-8 border-l-2 border-white/10 hover:bg-white/5 rounded-r-lg transition-colors py-4"
    >
      <div className="absolute left-0 top-0 -translate-x-2 -translate-y-1">
        <div className="h-4 w-4 rounded-full bg-green-400"></div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-semibold text-white">{event.name}</h3>
        <span className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-gray-300">
          {event.kind}
        </span>
        {event.applicationsOpen && (
          <span className="rounded-full bg-green-400/15 px-2 py-0.5 text-xs text-green-300">
            Applications open
          </span>
        )}
      </div>

      <p className="mt-1 text-gray-400">{event.location}</p>
      <p className="text-sm text-gray-500">{event.dateLabel}</p>

      {event.deadlineLabel && (
        <p className={`mt-1 text-sm ${deadlineSoon ? 'text-amber-300 font-semibold' : 'text-gray-400'}`}>
          {event.deadlineLabel}
        </p>
      )}

      <p className="mt-2 text-gray-300">{event.description}</p>

      <div className="mt-3 flex flex-wrap gap-3">
        {event.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              link.primary
                ? 'rounded-md bg-green-500/20 px-3 py-1 text-sm text-green-200 hover:bg-green-500/30 transition-colors'
                : 'px-1 py-1 text-sm text-blue-400 hover:underline'
            }
          >
            {link.label}
          </a>
        ))}
      </div>
    </motion.div>
  )
}

export default function UpcomingEvents() {
  const now = Date.now()
  const events = upcomingEvents.filter((e) => isUpcoming(e, now)).sort(sortEvents)

  const groups: { label: string; items: UpcomingEvent[] }[] = []
  for (const event of events) {
    const label = groupLabel(event)
    const group = groups.find((g) => g.label === label)
    if (group) group.items.push(event)
    else groups.push({ label, items: [event] })
  }

  let index = 0

  return (
    <section className="min-h-screen bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Upcoming Events
        </motion.h2>
        <p className="mt-4 text-gray-400">
          Conferences, hackathons, grants and calls for speakers I am tracking, with links to apply.
        </p>

        {groups.length === 0 && (
          <p className="mt-12 text-gray-400">Nothing scheduled right now. Check back soon.</p>
        )}

        {groups.map((group) => (
          <div key={group.label} className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-green-300/80">
              {group.label}
            </h3>
            <div className="mt-6 space-y-8">
              {group.items.map((event) => (
                <EventCard key={event.name} event={event} index={index++} now={now} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
