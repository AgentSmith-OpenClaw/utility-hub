import React, { useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzU2ODkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function base64UrlDecode(input: string): string {
  let str = input.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  try {
    const bin = atob(str);
    try {
      // Try UTF-8 decode
      return decodeURIComponent(
        bin
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
    } catch {
      return bin;
    }
  } catch {
    throw new Error('Invalid Base64URL segment');
  }
}

function pretty(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}

interface Decoded {
  header: string;
  payload: string;
  signature: string;
  headerObj?: Record<string, unknown>;
  payloadObj?: Record<string, unknown>;
  error?: string;
}

function decodeJwt(token: string): Decoded {
  const trimmed = token.trim();
  if (!trimmed) return { header: '', payload: '', signature: '' };
  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return { header: '', payload: '', signature: '', error: 'JWT must have three dot-separated parts.' };
  }
  try {
    const headerStr = base64UrlDecode(parts[0]);
    const payloadStr = base64UrlDecode(parts[1]);
    return {
      header: pretty(headerStr),
      payload: pretty(payloadStr),
      signature: parts[2],
      headerObj: JSON.parse(headerStr),
      payloadObj: JSON.parse(payloadStr),
    };
  } catch (e) {
    return {
      header: '',
      payload: '',
      signature: '',
      error: e instanceof Error ? e.message : 'Decode failed',
    };
  }
}

const TIME_KEYS = ['exp', 'iat', 'nbf', 'auth_time'];

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const decoded = useMemo(() => decodeJwt(token), [token]);

  const expiry = useMemo(() => {
    const exp = decoded.payloadObj?.['exp'];
    if (typeof exp !== 'number') return null;
    const expMs = exp * 1000;
    const now = Date.now();
    const diff = expMs - now;
    return {
      isExpired: diff <= 0,
      date: new Date(expMs).toUTCString(),
      relative: relativeTime(diff),
    };
  }, [decoded]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setToken(SAMPLE)}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-50"
        >
          Load sample
        </button>
        <button
          type="button"
          onClick={() => setToken('')}
          disabled={!token}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 disabled:opacity-40"
        >
          Clear
        </button>
        <span className="ml-auto text-[11px] text-slate-400">
          🔒 Decoding only — your token never leaves the browser
        </span>
      </div>

      <ToolCard title="JWT token">
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste a JWT (eyJ…)"
          spellCheck={false}
          className="w-full h-48 sm:h-56 px-4 py-3 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none break-all"
        />
      </ToolCard>

      {decoded.error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700">
          {decoded.error}
        </div>
      )}

      {decoded.header && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ToolCard
            title="Header"
            action={<CopyButton value={decoded.header} />}
          >
            <pre className="min-h-[10rem] px-4 py-3 text-[13px] sm:text-sm font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap break-all overflow-auto">
              {decoded.header}
            </pre>
          </ToolCard>
          <ToolCard
            title="Payload"
            action={<CopyButton value={decoded.payload} />}
          >
            <pre className="min-h-[10rem] px-4 py-3 text-[13px] sm:text-sm font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap break-all overflow-auto">
              {decoded.payload}
            </pre>
          </ToolCard>
        </div>
      )}

      {decoded.payloadObj && (
        <ToolCard title="Decoded claims">
          <div className="space-y-2">
            {Object.entries(decoded.payloadObj).map(([k, v]) => (
              <div key={k} className="flex items-start gap-3 text-sm">
                <span className="font-mono font-semibold text-emerald-700 w-28 flex-shrink-0">{k}</span>
                <span className="text-slate-700 break-all">
                  {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                  {TIME_KEYS.includes(k) && typeof v === 'number' && (
                    <span className="ml-2 text-[11px] text-slate-400">
                      ({new Date(v * 1000).toUTCString()})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </ToolCard>
      )}

      {expiry && (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            expiry.isExpired
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <strong>{expiry.isExpired ? 'Expired' : 'Active'}</strong> — {expiry.date}{' '}
          <span className="opacity-70">({expiry.relative})</span>
        </div>
      )}

      {decoded.signature && (
        <ToolCard
          title="Signature (Base64URL)"
          action={<CopyButton value={decoded.signature} />}
        >
          <code className="block px-4 py-3 text-[13px] sm:text-sm font-mono text-slate-700 break-all bg-slate-50 border border-slate-200 rounded-lg">{decoded.signature}</code>
          <p className="text-[11px] text-slate-400 mt-2.5">
            Verifying the signature requires the issuer&apos;s secret or public key — that&apos;s a server-side step.
          </p>
        </ToolCard>
      )}
    </div>
  );
}

function relativeTime(diffMs: number): string {
  const past = diffMs < 0;
  const abs = Math.abs(diffMs);
  const sec = Math.round(abs / 1000);
  if (sec < 60) return past ? `${sec}s ago` : `in ${sec}s`;
  const min = Math.round(sec / 60);
  if (min < 60) return past ? `${min}m ago` : `in ${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 48) return past ? `${hr}h ago` : `in ${hr}h`;
  const d = Math.round(hr / 24);
  if (d < 60) return past ? `${d}d ago` : `in ${d}d`;
  return new Date(Date.now() + diffMs).toDateString();
}
