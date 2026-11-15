import type { Metadata } from 'next'
import Link from 'next/link'
import UpcomingEvents from '@/components/UpcomingEvents'

export const metadata: Metadata = {
  title: 'Upcoming Events - 0xj4an',
  description: 'Conferences, hackathons, grants and calls for speakers 0xj4an is following, with links to apply.',
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/" className="text-sm text-gray-400 transition-colors hover:text-white">
          {'<- Back to 0xj4an.xyz'}
        </Link>
        <div className="mt-6">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  )
}
