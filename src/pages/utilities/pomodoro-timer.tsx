import Head from 'next/head';
import PomodoroTimer from '../../components/Utilities/PomodoroTimer';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/utilities/pomodoro-timer';

const FAQS = [
  { q: 'What is the Pomodoro Technique?', a: 'The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. Work is broken into 25-minute focused sessions (called "pomodoros") separated by 5-minute short breaks. After 4 pomodoros, take a 15-minute long break.' },
  { q: 'Can I customize the timer durations?', a: 'Yes. Click the Edit button in the Settings section to adjust focus, short break, and long break durations. Common variations include 50/10 (50 minutes of work, 10-minute break) for deep work, and 90/20 for ultradian rhythm alignment.' },
  { q: 'Does the timer work in the background?', a: 'The timer continues running if you switch browser tabs, but audio notifications are only triggered when the page is active or browser notifications are enabled. Enable notifications for reliable alerts when working in other tabs.' },
  { q: 'What triggers a long break?', a: 'A long break is triggered automatically after every 4 completed focus sessions (pomodoros). The session counter is shown below the timer.' },
  { q: 'Why 25 minutes for focus sessions?', a: 'Cirillo found 25 minutes strikes a balance between sustained focus and urgency. The finite time creates a sense of accountability. That said, longer sessions (45–90 min) may suit different work types — use the settings to customize.' },
];

export default function PomodoroTimerPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Pomodoro Timer',
    slug: SLUG,
    description: 'A free Pomodoro productivity timer with customizable focus, short break, and long break durations. Browser notifications and session history.',
    category: 'UtilitiesApplication',
    featureList: 'Focus timer, Short break, Long break, Customizable durations, Session history, Browser notifications',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Pomodoro Timer — Free Online Productivity Timer | Toolisk</title>
        <meta name="description" content="Free Pomodoro timer for focused work sessions. 25-minute focus blocks, 5-minute short breaks, 15-minute long breaks. Customizable, with session history and browser notifications." />
        <meta name="keywords" content="pomodoro timer, pomodoro technique, focus timer, productivity timer, work timer, time management, 25 minute timer, study timer" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Pomodoro Timer | Toolisk" />
        <meta property="og:description" content="Free Pomodoro productivity timer. Focus sessions, short breaks, long breaks — customizable and browser-based." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🍅" title="Pomodoro Timer" tagline="Stay focused with 25-minute work sessions, 5-minute breaks, and a 15-minute rest every four sessions." parent="utilities" theme="amber">
        <PomodoroTimer />
      </ToolShell>

      <ToolSEOContent
        description="A free browser-based Pomodoro timer following the classic 25/5/15 structure. Set focus sessions, short breaks, and long breaks with customizable durations. Sessions auto-advance, browser notifications alert you when time is up, and a session history tracks your progress."
        features={[
          '⏱️ Classic 25/5/15 Pomodoro structure',
          '⚙️ Customizable focus, short, and long break durations',
          '🔔 Browser push notifications when sessions end',
          '📊 Session history and progress tracking',
          '🔄 Auto-advance through phases',
          '🔒 No account or install required',
        ]}
        steps={[
          { title: 'Start a focus session', desc: 'Click Start to begin your 25-minute work session.' },
          { title: 'Take breaks when prompted', desc: 'After each session, the timer auto-switches to a short break.' },
          { title: 'Enable notifications', desc: 'Click "Enable notifications" so you get alerted even when in another tab.' },
          { title: 'Customize durations', desc: 'Click Edit in Settings to change session lengths to match your work style.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why the Pomodoro Technique works</h2>
            <p className="text-slate-600 leading-relaxed">
              The technique leverages time-boxing: by committing to work only until the timer rings, you reduce the anxiety of open-ended tasks. Knowing a break is coming soon makes it easier to resist distractions — you can check your phone at the break, not now.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The short breaks prevent mental fatigue and maintain overall energy throughout the day. The long break every four sessions allows for genuine recovery, especially for cognitive-intensive work like writing, coding, or studying.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Age & Date Calculator', href: '/utilities/age-calculator', icon: '📅' },
          { name: 'Timestamp Converter', href: '/tools/timestamp-converter', icon: '⏱️' },
          { name: 'Word Counter', href: '/tools/word-counter', icon: '✍️' },
        ]}
      />
    </>
  );
}
