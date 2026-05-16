import React, { useState, useCallback } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Algorithm = 'HS256' | 'HS384' | 'HS512';

const ALG_MAP: Record<Algorithm, { name: string; length: number }> = {
  HS256: { name: 'HMAC', length: 256 },
  HS384: { name: 'HMAC', length: 384 },
  HS512: { name: 'HMAC', length: 512 },
};

const DEFAULT_PAYLOAD = `{
  "sub": "user_42",
  "name": "Ada Lovelace",
  "iat": ${Math.floor(Date.now() / 1000)},
  "exp": ${Math.floor(Date.now() / 1000) + 3600}
}`;

function base64url(buf: Uint8Array): string {
  const bin = Array.from(buf, (b) => String.fromCharCode(b)).join('');
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeJSON(obj: object): string {
  return base64url(new TextEncoder().encode(JSON.stringify(obj)));
}

async function signJwt(header: object, payload: object, secret: string, alg: Algorithm): Promise<string> {
  const { name, length } = ALG_MAP[alg];
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name, hash: `SHA-${length}` },
    false,
    ['sign'],
  );
  const head = encodeJSON(header);
  const body = encodeJSON(payload);
  const sig = await crypto.subtle.sign(name, key, new TextEncoder().encode(`${head}.${body}`));
  return `${head}.${body}.${base64url(new Uint8Array(sig))}`;
}

export default function JwtGenerator() {
  const [alg, setAlg] = useState<Algorithm>('HS256');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const headerObj = { alg, typ: 'JWT' };

  const generate = useCallback(async () => {
    setError('');
    setToken('');
    if (!secret.trim()) { setError('Secret cannot be empty.'); return; }
    let parsed: object;
    try { parsed = JSON.parse(payloadText); }
    catch (e) { setError(`Payload JSON error: ${(e as Error).message}`); return; }
    setLoading(true);
    try {
      const jwt = await signJwt(headerObj, parsed, secret, alg);
      setToken(jwt);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [alg, secret, payloadText]);

  const insertClaim = (key: string, value: unknown) => {
    try {
      const obj = JSON.parse(payloadText) as Record<string, unknown>;
      obj[key] = value;
      setPayloadText(JSON.stringify(obj, null, 2));
    } catch { /* ignore */ }
  };

  const now = Math.floor(Date.now() / 1000);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left panel */}
        <div className="space-y-4">
          <ToolCard title="Algorithm & secret">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Algorithm</label>
                <div className="flex gap-2">
                  {(['HS256', 'HS384', 'HS512'] as Algorithm[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => setAlg(a)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border min-h-[44px] transition-colors ${alg === a ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Secret</label>
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="w-full font-mono text-sm px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none min-h-[44px]"
                />
              </div>
            </div>
          </ToolCard>

          <ToolCard title="Header (auto-generated)">
            <pre className="font-mono text-sm bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 text-slate-600">
              {JSON.stringify(headerObj, null, 2)}
            </pre>
          </ToolCard>
        </div>

        {/* Right panel */}
        <ToolCard title="Payload" action={
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => insertClaim('iat', now)} className="inline-flex items-center px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]">+ iat</button>
            <button onClick={() => insertClaim('exp', now + 3600)} className="inline-flex items-center px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]">+ exp (+1h)</button>
            <button onClick={() => insertClaim('nbf', now)} className="inline-flex items-center px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]">+ nbf</button>
          </div>
        }>
          <textarea
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            className="w-full min-h-[200px] font-mono text-sm p-3 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none"
          />
        </ToolCard>
      </div>

      {/* Generate button */}
      <div className="flex justify-center">
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 min-h-[44px] transition-colors"
        >
          {loading ? 'Signing…' : 'Generate JWT'}
        </button>
      </div>

      {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}

      {token && (
        <ToolCard title="Signed JWT" action={<CopyButton value={token} />}>
          <div className="font-mono text-xs bg-slate-50 rounded-lg border border-slate-200 p-3 break-all leading-relaxed">
            {token.split('.').map((part, i) => (
              <span key={i} className={['text-rose-600', 'text-emerald-700', 'text-sky-600'][i]}>
                {part}{i < 2 ? '.' : ''}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Header (red) · Payload (green) · Signature (blue) ·{' '}
            <a href="/tools/jwt-decoder" className="text-emerald-600 underline underline-offset-2">Decode this token →</a>
          </p>
        </ToolCard>
      )}

      {/* Security notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        <strong>Security:</strong> Signing happens locally in your browser via the WebCrypto API — no data is sent to a server.
        That said, never paste a real production secret into any website. Use this tool with test secrets only.
      </div>
    </div>
  );
}
