import Head from 'next/head';
import AgeCalculator from '../../components/Utilities/AgeCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/utilities/age-calculator';

const FAQS = [
  { q: 'How is age calculated exactly?', a: 'Age is computed by subtracting the birth date from the reference date in years, months, and remaining days. For example, if you were born on March 15, 1990 and today is January 10, 2025, you are 34 years, 9 months, and 26 days old.' },
  { q: 'Can I calculate age at a past or future date?', a: 'Yes. Set the "As of date" field to any date — past or future — to see how old someone will be or was at that point.' },
  { q: 'How many days between two dates?', a: 'Use the Date Difference mode. It counts the total number of days (and converts to weeks, hours, and minutes) between any two dates you choose.' },
  { q: 'What does adding days to a date mean?', a: 'The Add / Subtract Days mode takes a start date and a number of days, then tells you the resulting date. Useful for deadline math: "30 days from today" or "45 days before an event."' },
  { q: 'Does the calculator handle leap years?', a: 'Yes. JavaScript\'s Date object correctly accounts for leap years, so February 29 birthdays and calculations spanning leap years are handled accurately.' },
];

export default function AgeCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Age & Date Calculator',
    slug: SLUG,
    description: 'Calculate exact age from birthday, find days between two dates, and add or subtract days from any date.',
    category: 'UtilitiesApplication',
    featureList: 'Age from birthday, Date difference, Add/subtract days, Next birthday countdown',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Age Calculator — Exact Age, Date Difference & Deadline Math | Toolisk</title>
        <meta name="description" content="Calculate your exact age in years, months, and days. Find the number of days between two dates. Add or subtract days from any date. Free and instant." />
        <meta name="keywords" content="age calculator, date difference calculator, days between dates, how old am i, birthday calculator, add days to date, deadline calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Age & Date Calculator | Toolisk" />
        <meta property="og:description" content="Calculate exact age, date differences, and deadline math instantly." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="📅" title="Age & Date Calculator" tagline="Find your exact age, count days between dates, or add days to any date — three tools in one." parent="utilities" theme="amber">
        <AgeCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A three-in-one date calculator: compute your exact age in years/months/days (with next-birthday countdown), find the difference between any two dates in days/weeks/hours/minutes, and do deadline math by adding or subtracting any number of days from a date."
        features={[
          '🎂 Exact age in years, months, and days',
          '⏳ Days, weeks, hours, and minutes between dates',
          '📆 Add or subtract days for deadline math',
          '🎉 Next birthday countdown',
          '🔄 Works for past and future dates',
          '📋 Copy any result instantly',
        ]}
        steps={[
          { title: 'Choose a mode', desc: 'Age Calculator, Date Difference, or Add / Subtract Days.' },
          { title: 'Enter your dates', desc: 'Pick dates with the date pickers — no manual typing required.' },
          { title: 'Read the results', desc: 'Years, months, days, total days, weeks, hours, and minutes all calculated at once.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Common date calculation scenarios</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Legal and medical age:</strong> precise age as of a specific hearing or appointment date</li>
              <li><strong>Project deadlines:</strong> 30, 60, or 90 business-day calculations</li>
              <li><strong>Subscription renewals:</strong> how many days until a contract expires</li>
              <li><strong>Historical research:</strong> how long ago a historical event occurred</li>
              <li><strong>Retirement planning:</strong> how many days until a target date</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Timestamp Converter', href: '/tools/timestamp-converter', icon: '⏱️' },
          { name: 'Percentage Calculator', href: '/utilities/percentage-calculator', icon: '%' },
          { name: 'Pomodoro Timer', href: '/utilities/pomodoro-timer', icon: '🍅' },
        ]}
      />
    </>
  );
}
