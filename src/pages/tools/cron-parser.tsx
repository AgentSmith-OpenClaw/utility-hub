import Head from 'next/head';
import CronParser from '../../components/Tools/CronParser';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/cron-parser';

export default function CronParserPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cron Expression Parser',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Parse cron expressions into plain English and preview the next 10 scheduled runs. Includes presets for common schedules.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'Cron expression validation, Plain-English description, Next-run preview, Common-schedule presets, Range and step parsing',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What\'s the cron expression format?', acceptedAnswer: { '@type': 'Answer', text: 'Five space-separated fields: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6, Sunday=0). Use * for "any", */N for "every N", and ranges like 1-5.' } },
      { '@type': 'Question', name: 'Why does my cron job run more often than expected?', acceptedAnswer: { '@type': 'Answer', text: 'When both day-of-month and day-of-week are specified (neither is *), most cron implementations run when EITHER matches. So "0 0 1 * 1" fires on the 1st of every month AND every Monday.' } },
      { '@type': 'Question', name: 'How do I run something every 90 minutes?', acceptedAnswer: { '@type': 'Answer', text: 'You can\'t directly — cron only supports intra-hour or intra-day patterns, not arbitrary intervals that don\'t divide cleanly into 60. The workaround is two entries: "0 0,3,6,9,12,15,18,21 * * *" for every 3 hours starting midnight, plus "30 1,4,7,10,13,16,19,22 * * *" for the 90-min offsets.' } },
      { '@type': 'Question', name: 'What timezone do cron jobs run in?', acceptedAnswer: { '@type': 'Answer', text: 'Traditional Unix cron uses the system timezone. Cloud schedulers (AWS EventBridge, GCP Cloud Scheduler, Vercel Cron) typically default to UTC. Always check your scheduler\'s docs and explicitly set TZ if needed.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>Cron Expression Parser — Validate and Preview | Toolisk</title>
        <meta name="description" content="Free cron expression parser and validator. Convert any cron schedule to plain English. Preview the next 10 runs. Built-in presets for common schedules." />
        <meta name="keywords" content="cron expression, cron parser, cron validator, crontab generator, cron schedule, cron next run, cron explained" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Cron Expression Parser | Toolisk" />
        <meta property="og:description" content="Validate cron expressions and preview the next 10 runs in plain English." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="⏰" title="Cron Expression Parser" tagline="Type any cron expression to see a plain-English description and the next 10 scheduled runs in UTC.">
        <CronParser />
      </ToolShell>

      <ToolSEOContent
        description="A cron expression parser that validates the syntax, explains the schedule in plain English, and shows you the next 10 runs in UTC. Perfect for scheduling cloud functions, background jobs, and crontab entries you can&apos;t afford to get wrong."
        features={[
          '🧠 Plain-English schedule description',
          '🗓️ Next 10 runs preview (UTC)',
          '✅ Step (*/N) and range (1-5) support',
          '⚡ One-click presets for common patterns',
          '🪶 Aliases: @daily, @hourly, @weekly',
          '📋 Copy expressions to clipboard',
        ]}
        steps={[
          { title: 'Type or pick a preset', desc: 'Start with a built-in preset and adapt, or type from scratch.' },
          { title: 'Read the description', desc: 'The plain-English summary tells you what your expression actually does.' },
          { title: 'Verify next runs', desc: 'The 10 upcoming run timestamps make scheduling bugs obvious before deploy.' },
          { title: 'Copy and paste', desc: 'Drop into crontab, GitHub Actions, AWS EventBridge, or Cloud Scheduler.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Cron field reference</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-slate-200">
                    <th className="py-2 pr-4 font-semibold text-slate-700">Field</th>
                    <th className="py-2 pr-4 font-semibold text-slate-700">Range</th>
                    <th className="py-2 pr-4 font-semibold text-slate-700">Special chars</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['Minute', '0-59', '* , - /'],
                    ['Hour', '0-23', '* , - /'],
                    ['Day of month', '1-31', '* , - /'],
                    ['Month', '1-12', '* , - /'],
                    ['Day of week', '0-6 (Sun=0)', '* , - /'],
                  ].map(([f, r, c]) => (
                    <tr key={f}>
                      <td className="py-2 pr-4 font-mono">{f}</td>
                      <td className="py-2 pr-4 font-mono text-slate-600">{r}</td>
                      <td className="py-2 pr-4 font-mono text-slate-600">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Common gotchas</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Day-of-month + day-of-week:</strong> if both are non-*, most implementations OR them, not AND.</li>
              <li><strong>Timezones:</strong> cloud schedulers usually default to UTC; system cron uses local TZ.</li>
              <li><strong>Steps don&apos;t straddle:</strong> <code>*/15</code> on the hour field means 0, 15, 30, 45 — not arbitrary 15-minute intervals across hour boundaries.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Timestamp Converter', href: '/tools/timestamp-converter', icon: '⏱️' },
          { name: 'UUID Generator', href: '/tools/uuid-generator', icon: '🆔' },
          { name: 'JSON Viewer', href: '/tools/json-viewer', icon: '🧩' },
        ]}
      />
    </>
  );
}
