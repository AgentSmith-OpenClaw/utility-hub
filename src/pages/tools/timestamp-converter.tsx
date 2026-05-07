import Head from 'next/head';
import TimestampConverter from '../../components/Tools/TimestampConverter';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function TimestampConverterPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/timestamp-converter');

  return (
    <>
      <Head>
        <title>Unix Timestamp Converter — Date to Timestamp & Back | Toolisk</title>
        <meta
          name="description"
          content="Convert Unix timestamps to human-readable dates and back. Supports seconds, milliseconds, ISO 8601, and relative time formatting."
        />
        <meta
          name="keywords"
          content="unix timestamp converter, epoch converter, date to timestamp, ISO 8601 converter, timestamp to date"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/timestamp-converter`} />
        <meta property="og:title" content="Unix Timestamp Converter | Toolisk" />
        <meta property="og:description" content="Convert Unix timestamps to dates and back." />
        <meta property="og:url" content={`${SITE_URL}/tools/timestamp-converter`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <ToolShell
        icon="⏱️"
        title="Timestamp Converter"
        tagline="Convert Unix timestamps to readable dates, and parse dates into seconds or milliseconds — instantly."
      >
        <TimestampConverter />
      </ToolShell>

      <ToolSEOContent
        description="A two-way converter between Unix timestamps and human-readable dates. The tool always shows the current Unix time, and lets you input a timestamp (in seconds or milliseconds) or any common date string to see all common formats — local, UTC, ISO 8601, RFC 2822, and relative time."
        features={[
          '⏰ Live current Unix time (seconds and milliseconds)',
          '🔄 Two-way conversion (timestamp ↔ date)',
          '🌐 Local time, UTC, ISO 8601, RFC 2822',
          '⏳ Relative time (e.g. "3 hours ago")',
          '📋 One-click copy for any format',
          '🛡️ Runs entirely in your browser',
        ]}
        steps={[
          { title: 'See the current time', desc: 'The top panel shows Unix seconds, Unix milliseconds, and ISO 8601 right now.' },
          { title: 'Convert a timestamp', desc: 'Paste a Unix timestamp and pick seconds or milliseconds. The tool shows local, UTC, ISO, and relative formats.' },
          { title: 'Convert a date', desc: 'Type a date in almost any common format — ISO 8601, RFC 2822, or natural language — to get the timestamp.' },
        ]}
        faqs={[
          {
            q: 'Are Unix timestamps in seconds or milliseconds?',
            a: 'It depends on the system. Unix originally measured in seconds (the number of seconds since 1970-01-01 UTC). JavaScript and most modern web APIs use milliseconds. The tool lets you toggle between the two — if your number has 13 digits, it\'s probably milliseconds; 10 digits, probably seconds.',
          },
          {
            q: 'What is ISO 8601?',
            a: 'ISO 8601 is a standardized date format like 2026-05-07T08:30:00Z. It\'s unambiguous (year-month-day order), sortable as a string, and supported by virtually every programming language and database.',
          },
          {
            q: 'What is the Year 2038 problem?',
            a: 'Unix timestamps stored in signed 32-bit integers will overflow on January 19, 2038 at 03:14:08 UTC. Modern systems use 64-bit timestamps to avoid this, but legacy systems and some embedded devices may still need updating.',
          },
          {
            q: 'How accurate is the relative time?',
            a: "The relative time is rounded to the nearest sensible unit (seconds, minutes, hours, days, months, years). It's intended for human-readable display, not precise measurement.",
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">A 60-second guide to Unix time</h2>
            <p className="text-slate-600 leading-relaxed">
              Unix time is the number of seconds (or milliseconds) since the &ldquo;Unix epoch&rdquo;:
              <strong> 1970-01-01 00:00:00 UTC</strong>. It&apos;s a single integer that doesn&apos;t care about
              timezones, daylight saving, or calendar quirks — perfect for storing and comparing timestamps in databases
              and APIs.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The catch is that Unix time is unreadable to humans. <code className="text-xs bg-slate-100 px-1 rounded">1782518400</code>{' '}
              tells you nothing without conversion. That&apos;s why every API that exposes timestamps either pairs them
              with a human-readable string or expects you to convert on the client. This tool exists to bridge that gap
              when you&apos;re debugging a payload, reading a log, or constructing a query.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Storing dates: a quick rule of thumb</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>For machine-to-machine:</strong> store as Unix timestamp (seconds or ms) or ISO 8601 UTC.</li>
              <li><strong>For display:</strong> always convert to the user&apos;s local timezone at render time.</li>
              <li><strong>Never:</strong> store dates in the user&apos;s timezone — you can&apos;t reliably reconstruct UTC from a local string without timezone metadata.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'UUID Generator', href: '/tools/uuid-generator', icon: '🆔' },
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
        ]}
      />
    </>
  );
}
