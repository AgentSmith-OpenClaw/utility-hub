import React, { useState, useMemo, useEffect } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

interface UAResult {
  browser: string;
  browserVersion: string;
  engine: string;
  engineVersion: string;
  os: string;
  osVersion: string;
  device: string;
  cpu: string;
  isBot: boolean;
}

const PRESETS: { label: string; ua: string }[] = [
  { label: 'Chrome 124 Mac', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' },
  { label: 'Safari iOS 17', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' },
  { label: 'Firefox 125 Win', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0' },
  { label: 'Edge 124 Win', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0' },
  { label: 'Googlebot', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
  { label: 'curl 8.6', ua: 'curl/8.6.0' },
  { label: 'Android Chrome', ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36' },
  { label: 'Samsung Internet', ua: 'Mozilla/5.0 (Linux; Android 14; SM-S926B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36' },
];

function parseUA(ua: string): UAResult {
  const s = ua;

  // Bot detection
  const isBot = /bot|crawler|spider|crawl|slurp|facebookexternalhit|curl|wget|python-requests|Java\//i.test(s);

  // Browser
  let browser = 'Unknown';
  let browserVersion = '';

  if (/OPR\//.test(s)) {
    browser = 'Opera'; browserVersion = (s.match(/OPR\/([\d.]+)/) || [])[1] || '';
  } else if (/Edg\//.test(s)) {
    browser = 'Edge'; browserVersion = (s.match(/Edg\/([\d.]+)/) || [])[1] || '';
  } else if (/SamsungBrowser\//.test(s)) {
    browser = 'Samsung Internet'; browserVersion = (s.match(/SamsungBrowser\/([\d.]+)/) || [])[1] || '';
  } else if (/Firefox\//.test(s)) {
    browser = 'Firefox'; browserVersion = (s.match(/Firefox\/([\d.]+)/) || [])[1] || '';
  } else if (/Chrome\//.test(s) && !/Chromium/.test(s)) {
    browser = 'Chrome'; browserVersion = (s.match(/Chrome\/([\d.]+)/) || [])[1] || '';
  } else if (/Chromium\//.test(s)) {
    browser = 'Chromium'; browserVersion = (s.match(/Chromium\/([\d.]+)/) || [])[1] || '';
  } else if (/Version\/[\d.]+.*Safari/.test(s)) {
    browser = 'Safari'; browserVersion = (s.match(/Version\/([\d.]+)/) || [])[1] || '';
  } else if (/curl\//.test(s)) {
    browser = 'curl'; browserVersion = (s.match(/curl\/([\d.]+)/) || [])[1] || '';
  } else if (/Googlebot/.test(s)) {
    browser = 'Googlebot'; browserVersion = (s.match(/Googlebot\/([\d.]+)/) || [])[1] || '';
  }

  // Engine
  let engine = 'Unknown';
  let engineVersion = '';
  if (/Gecko\/\d+.*Firefox/.test(s))    { engine = 'Gecko';   engineVersion = (s.match(/rv:([\d.]+)/) || [])[1] || ''; }
  else if (/AppleWebKit\//.test(s))      { engine = 'Blink/WebKit'; engineVersion = (s.match(/AppleWebKit\/([\d.]+)/) || [])[1] || ''; }

  // OS
  let os = 'Unknown';
  let osVersion = '';
  if (/iPhone OS ([\d_]+)/.test(s))     { os = 'iOS';       osVersion = ((s.match(/iPhone OS ([\d_]+)/) || [])[1] || '').replace(/_/g, '.'); }
  else if (/iPad.*OS ([\d_]+)/.test(s)) { os = 'iPadOS';    osVersion = ((s.match(/OS ([\d_]+)/) || [])[1] || '').replace(/_/g, '.'); }
  else if (/Android ([\d.]+)/.test(s))  { os = 'Android';   osVersion = (s.match(/Android ([\d.]+)/) || [])[1] || ''; }
  else if (/Windows NT ([\d.]+)/.test(s)) {
    os = 'Windows';
    const v: Record<string, string> = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista' };
    const nt = (s.match(/Windows NT ([\d.]+)/) || [])[1] || '';
    osVersion = v[nt] || nt;
  }
  else if (/Mac OS X ([\d_]+)/.test(s)) { os = 'macOS';     osVersion = ((s.match(/Mac OS X ([\d_]+)/) || [])[1] || '').replace(/_/g, '.'); }
  else if (/Linux/.test(s))             { os = 'Linux';      osVersion = ''; }
  else if (/CrOS/.test(s))              { os = 'ChromeOS';   osVersion = ''; }

  // Device
  let device = 'Desktop';
  if (/Mobile|iPhone|Android.*Mobile|IEMobile/.test(s)) device = 'Mobile';
  else if (/Tablet|iPad|Android(?!.*Mobile)/.test(s)) device = 'Tablet';
  else if (isBot) device = 'Bot / Crawler';

  // CPU
  let cpu = '';
  if (/Win64|x64|x86_64/.test(s))   cpu = 'x86-64';
  else if (/ARM|aarch64|arm64/.test(s)) cpu = 'ARM64';
  else if (/Intel/.test(s))          cpu = 'Intel';

  return { browser, browserVersion, engine, engineVersion, os, osVersion, device, cpu, isBot };
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <span className={`text-sm text-slate-900 font-semibold text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

export default function UserAgentParser() {
  const [ua, setUa] = useState('');

  useEffect(() => {
    setUa(navigator.userAgent);
  }, []);

  const result = useMemo<UAResult | null>(() => {
    if (!ua.trim()) return null;
    return parseUA(ua);
  }, [ua]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <ToolCard
        title="User-Agent string"
        action={
          <button
            onClick={() => setUa(navigator.userAgent)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]"
          >
            Use my browser's UA
          </button>
        }
      >
        <textarea
          value={ua}
          onChange={(e) => setUa(e.target.value)}
          rows={3}
          placeholder="Paste a User-Agent string…"
          className="w-full font-mono text-sm p-3 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none"
        />
      </ToolCard>

      {/* Presets */}
      <ToolCard title="Presets">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => setUa(p.ua)}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]">
              {p.label}
            </button>
          ))}
        </div>
      </ToolCard>

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <ToolCard title="Browser & engine">
            {result.isBot && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-semibold">
                🤖 Likely a bot / crawler
              </div>
            )}
            <InfoRow label="Browser"        value={result.browser} />
            <InfoRow label="Version"        value={result.browserVersion} mono />
            <InfoRow label="Engine"         value={result.engine} />
            <InfoRow label="Engine version" value={result.engineVersion} mono />
          </ToolCard>

          <ToolCard title="OS & device">
            <InfoRow label="OS"         value={result.os} />
            <InfoRow label="OS version" value={result.osVersion} mono />
            <InfoRow label="Device"     value={result.device} />
            <InfoRow label="CPU"        value={result.cpu} />
          </ToolCard>
        </div>
      )}

      {ua && result && (
        <ToolCard title="Raw string" action={<CopyButton value={ua} />}>
          <p className="font-mono text-xs text-slate-600 bg-slate-50 rounded-lg border border-slate-200 p-3 break-all">{ua}</p>
        </ToolCard>
      )}
    </div>
  );
}
