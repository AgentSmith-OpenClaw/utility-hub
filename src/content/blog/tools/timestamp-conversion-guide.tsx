import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const timestampConversionGuide: BlogArticle = {
  slug: 'timestamp-conversion-guide',
  category: 'Developer',
  title: 'Timestamp Conversion: Unix Time, ISO 8601, and the Time Zone Problems Nobody Warns You About',
  description:
    'Time zones, daylight saving, leap seconds, the Year 2038 problem. Learn the formats, the gotchas, and the rules that make timestamps reliable across systems.',
  publishedDate: '2026-05-08',
  readTime: '12 min read',
  keywords:
    'unix timestamp, iso 8601, epoch time, time zone, datetime, utc, javascript date, year 2038',
  relatedTools: [
    { name: 'Timestamp Converter', href: '/tools/timestamp-converter' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Most date bugs come from the same handful of mistakes: storing local time, comparing strings instead of
        numbers, ignoring daylight saving, or treating "the day a user clicked save" as a meaningful
        global concept. Learning what to store, what to display, and what to compare prevents 90% of them.
      </Lead>

      <H2>Three formats you'll encounter</H2>

      <H3>1. Unix timestamp (epoch time)</H3>
      <p>
        Number of seconds since 1970-01-01 00:00:00 UTC. Sometimes in milliseconds (JavaScript), microseconds
        (some databases), or nanoseconds (Go).
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><code>1730000000</code> = Oct 27, 2024 02:13:20 UTC</li>
        <li>Best for storing &amp; comparing — single number, no time zone confusion.</li>
        <li>Worst for human reading — opaque without conversion.</li>
      </ul>

      <H3>2. ISO 8601</H3>
      <p>
        Human-readable but unambiguous: <code>2024-10-27T02:13:20Z</code>. The <code>Z</code> means UTC; an offset
        like <code>+05:30</code> indicates a specific time zone.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Best for APIs and logs — unambiguous, sortable as strings.</li>
        <li>Always include the time zone (Z or offset). Never store as "naive" local time.</li>
      </ul>

      <H3>3. RFC 2822 / Email Date format</H3>
      <p>
        <code>Sun, 27 Oct 2024 02:13:20 GMT</code>. Common in HTTP headers and email. Avoid for new systems.
      </p>

      <H2>The cardinal rules</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>Store everything in UTC.</strong> Convert to local time only at display.</li>
        <li><strong>Use Unix timestamps for storage and comparison; ISO 8601 for transit.</strong></li>
        <li><strong>Never compare or sort time zone-naive local times.</strong> "9 AM" means different things in different zones.</li>
        <li><strong>Always specify the time zone when displaying.</strong> "3:00 PM ET" is clear; "3:00 PM" is ambiguous.</li>
      </ol>

      <H2>The time zone is not just an offset</H2>
      <p>
        America/New_York is sometimes UTC-5 (EST) and sometimes UTC-4 (EDT) — the offset changes twice a year for
        daylight saving. Store the IANA time zone name, not the offset, if you need to display future events
        correctly.
      </p>
      <p>
        Example: a meeting scheduled for "3 PM in New York on March 15, 2027." If you stored the
        offset as UTC-5, but DST starts on March 8, 2027, your event would display at the wrong time. Store
        "America/New_York" and let the time-zone library compute the offset at display time.
      </p>

      <Callout title="The DST gotcha" accent="amber">
        On the "spring forward" day, 2:00–3:00 AM doesn't exist. On "fall back",
        1:00–2:00 AM happens twice. If your system processes scheduled events "every minute," you can
        either skip 60 minutes of work or do it twice. Use UTC to schedule and you're immune.
      </Callout>

      <H2>The JavaScript Date trap</H2>
      <p>
        JavaScript's built-in Date object has notorious quirks:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><code>new Date('2024-10-27')</code> is parsed as <em>UTC</em> midnight (ISO interpretation).</li>
        <li><code>new Date('2024/10/27')</code> is parsed as <em>local</em> midnight.</li>
        <li><code>new Date('10/27/2024')</code> is parsed as US-style local; ambiguous in many locales.</li>
        <li>Months are 0-indexed: <code>new Date(2024, 9, 27)</code> = October 27.</li>
      </ul>
      <p>
        Use a real library for non-trivial work: <strong>date-fns</strong> (functional, tree-shakable),
        <strong>Luxon</strong> (immutable, full TZ support), or <strong>Temporal</strong> (the upcoming
        standard).
      </p>

      <H2>The Year 2038 problem</H2>
      <p>
        32-bit signed integer Unix timestamps overflow on January 19, 2038 at 03:14:07 UTC. Any system using
        a 32-bit <code>time_t</code> will report dates after this as 1901 or fail outright.
      </p>
      <p>
        Most modern systems have moved to 64-bit timestamps (good for ~292 billion years). But:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Embedded systems, legacy databases, and some financial systems still use 32-bit.</li>
        <li>MySQL <code>TIMESTAMP</code> column is 32-bit. Use <code>DATETIME</code> for dates beyond 2038.</li>
        <li>Some cookies and HTTP cache headers are still 32-bit.</li>
      </ul>

      <H2>Microseconds and high-precision time</H2>
      <p>
        For high-frequency systems (financial trading, distributed systems, observability), seconds aren't
        enough. Common precisions:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Milliseconds:</strong> JavaScript's default. Most web APIs.</li>
        <li><strong>Microseconds:</strong> PostgreSQL's default for <code>timestamp</code>. Linux <code>gettimeofday()</code>.</li>
        <li><strong>Nanoseconds:</strong> Go's <code>time.Time</code>. Modern <code>clock_gettime()</code>.</li>
      </ul>
      <p>
        When converting between systems, watch for unit mismatches. A "timestamp 1730000000" in
        seconds is October 2024; in milliseconds, it's January 1970.
      </p>

      <H2>Common bugs and their fixes</H2>

      <H3>Bug: dates off by hours</H3>
      <p>
        Server stores in UTC, client displays in local time, but conversion code mixes them. Make conversion
        explicit at the display boundary, not in business logic.
      </p>

      <H3>Bug: events "disappearing" on certain days</H3>
      <p>
        Storing dates as <code>YYYY-MM-DD</code> strings and parsing them as JavaScript Dates causes them to
        appear as "previous day" in negative-UTC time zones. Use date-only types
        (PostgreSQL <code>date</code>, Java <code>LocalDate</code>, etc.) or treat date strings as opaque.
      </p>

      <H3>Bug: filtering "today" returns wrong rows</H3>
      <p>
        "Today" depends on the time zone. A user in Tokyo and a user in San Francisco are looking at
        different days for 7+ hours each day. Define "today" in the user's time zone, not the
        server's.
      </p>

      <H3>Bug: scheduled jobs running at the wrong time during DST</H3>
      <p>
        Cron schedules in "local" time can skip or repeat hours during DST transitions. Always run
        cron in UTC (or a fixed-offset zone like UTC+9 for Tokyo) and convert if needed.
      </p>

      <H2>Database storage best practices</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>PostgreSQL:</strong> use <code>TIMESTAMPTZ</code>, not <code>TIMESTAMP</code>. Stores in UTC, displays in session time zone. <code>TIMESTAMP</code> is "naive" — store at your peril.</li>
        <li><strong>MySQL:</strong> <code>DATETIME</code> for dates after 2038, <code>TIMESTAMP</code> auto-converts to UTC and back to session zone. Pick one and document.</li>
        <li><strong>SQLite:</strong> no native timestamp type — use ISO 8601 text or Unix integer.</li>
        <li><strong>MongoDB:</strong> Date type stores in UTC milliseconds. Always convert to UTC before insert.</li>
      </ul>

      <H2>Client-side display</H2>
      <p>
        Modern browsers expose the user's time zone via <code>Intl.DateTimeFormat().resolvedOptions().timeZone</code>.
        Use it to convert UTC server timestamps for display, but consider letting users override it (for shared
        team contexts where everyone needs to see the same time).
      </p>

      <KeyTakeaways
        items={[
          'Store in UTC. Convert to local time only at display. Never store time zone-naive local times.',
          'Use Unix timestamps for comparison/storage; ISO 8601 (with Z or offset) for APIs.',
          'Time zones aren\'t fixed offsets — DST changes them. Store IANA names like \'America/New_York\' for future events.',
          'JavaScript Date has known quirks: parse with care, prefer date-fns/Luxon/Temporal for non-trivial work.',
          'Year 2038 problem still affects legacy systems. MySQL TIMESTAMP overflows; use DATETIME for dates beyond 2038.',
        ]}
      />

      <p>
        Convert any timestamp instantly using our{' '}
        <Link href="/tools/timestamp-converter" className="text-emerald-600 font-semibold hover:underline">Timestamp Converter</Link>.
      </p>
    </div>
  ),
};
