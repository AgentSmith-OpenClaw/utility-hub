import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const SAMPLE = `curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer TOKEN123" \\
  -d '{"name":"Ada","email":"ada@example.com"}'`;

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
  user: string | null;
  compressed: boolean;
}

function tokenize(input: string): string[] {
  const line = input.replace(/\\\n\s*/g, ' ').trim();
  const tokens: string[] = [];
  let i = 0;
  while (i < line.length) {
    while (i < line.length && /\s/.test(line[i])) i++;
    if (i >= line.length) break;
    if (line[i] === "'" || line[i] === '"') {
      const q = line[i++];
      let s = '';
      while (i < line.length && line[i] !== q) {
        if (line[i] === '\\' && i + 1 < line.length) { i++; s += line[i]; }
        else s += line[i];
        i++;
      }
      i++;
      tokens.push(s);
    } else {
      let s = '';
      while (i < line.length && !/\s/.test(line[i])) s += line[i++];
      tokens.push(s);
    }
  }
  return tokens;
}

function parseCurl(input: string): ParsedCurl | null {
  const tokens = tokenize(input);
  if (!tokens.length || tokens[0].toLowerCase() !== 'curl') return null;

  const result: ParsedCurl = { method: 'GET', url: '', headers: {}, body: null, user: null, compressed: false };
  let i = 1;

  while (i < tokens.length) {
    const t = tokens[i];
    if ((t === '-X' || t === '--request') && i + 1 < tokens.length) {
      result.method = tokens[++i].toUpperCase();
    } else if ((t === '-H' || t === '--header') && i + 1 < tokens.length) {
      const hdr = tokens[++i];
      const idx = hdr.indexOf(':');
      if (idx > -1) result.headers[hdr.slice(0, idx).trim()] = hdr.slice(idx + 1).trim();
    } else if ((t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary') && i + 1 < tokens.length) {
      result.body = tokens[++i];
      if (result.method === 'GET') result.method = 'POST';
    } else if (t === '--data-urlencode' && i + 1 < tokens.length) {
      result.body = tokens[++i];
      if (result.method === 'GET') result.method = 'POST';
    } else if ((t === '-u' || t === '--user') && i + 1 < tokens.length) {
      result.user = tokens[++i];
    } else if (t === '--compressed') {
      result.compressed = true;
    } else if (!t.startsWith('-') && !result.url) {
      result.url = t;
    }
    i++;
  }

  if (!result.url) return null;
  return result;
}

// Code generators
function toFetch(p: ParsedCurl): string {
  const headers = { ...p.headers };
  if (p.user) headers['Authorization'] = 'Basic ' + btoa(p.user);
  const hdrsStr = Object.keys(headers).length
    ? `\n    headers: {\n${Object.entries(headers).map(([k, v]) => `      '${k}': '${v}'`).join(',\n')}\n    },`
    : '';
  const bodyStr = p.body ? `\n    body: ${JSON.stringify(p.body)},` : '';
  const methodStr = p.method !== 'GET' ? `\n    method: '${p.method}',` : '';
  const hasOpts = hdrsStr || bodyStr || methodStr;
  return `const response = await fetch('${p.url}', {${methodStr}${hdrsStr}${bodyStr}
});
const data = await response.json();
console.log(data);`;
}

function toAxios(p: ParsedCurl): string {
  const headers = { ...p.headers };
  if (p.user) headers['Authorization'] = 'Basic ' + btoa(p.user);
  const hdrsStr = Object.keys(headers).length
    ? `  headers: {\n${Object.entries(headers).map(([k, v]) => `    '${k}': '${v}'`).join(',\n')}\n  },\n` : '';
  const bodyKey = p.method === 'GET' ? '' : p.body ? `  data: ${JSON.stringify(p.body)},\n` : '';
  return `import axios from 'axios';

const response = await axios({
  method: '${p.method.toLowerCase()}',
  url: '${p.url}',
${hdrsStr}${bodyKey}});
console.log(response.data);`;
}

function toPython(p: ParsedCurl): string {
  const headers = { ...p.headers };
  if (p.user) headers['Authorization'] = 'Basic ' + btoa(p.user);
  const hdrs = Object.entries(headers).map(([k, v]) => `    "${k}": "${v}"`).join(',\n');
  const hdrsStr = hdrs ? `headers = {\n${hdrs}\n}\n` : '';
  const bodyStr = p.body ? `data = ${JSON.stringify(p.body)}\n` : '';
  const bodyArg = p.body ? ', data=data' : '';
  const hdrsArg = hdrs ? ', headers=headers' : '';
  return `import requests

${hdrsStr}${bodyStr}response = requests.${p.method.toLowerCase()}(
    "${p.url}"${hdrsArg}${bodyArg}
)
print(response.json())`;
}

function toNode(p: ParsedCurl): string {
  const u = new URL(p.url.includes('://') ? p.url : 'https://' + p.url);
  const headers = { ...p.headers };
  if (p.user) headers['Authorization'] = 'Basic ' + btoa(p.user);
  const hdrs = Object.entries(headers).map(([k, v]) => `  '${k}': '${v}'`).join(',\n');
  return `const https = require('https');

const options = {
  hostname: '${u.hostname}',
  path: '${u.pathname}${u.search}',
  method: '${p.method}',
  headers: {\n${hdrs}\n  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});
req.on('error', console.error);
${p.body ? `req.write(${JSON.stringify(p.body)});` : ''}
req.end();`;
}

type Lang = 'fetch' | 'axios' | 'python' | 'node';
const LANGS: { key: Lang; label: string }[] = [
  { key: 'fetch', label: 'fetch' },
  { key: 'axios', label: 'axios' },
  { key: 'python', label: 'Python' },
  { key: 'node', label: 'Node http' },
];

export default function CurlToCode() {
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<Lang>('fetch');

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    return parseCurl(input);
  }, [input]);

  const output = useMemo(() => {
    if (!parsed) return '';
    try {
      switch (lang) {
        case 'fetch':  return toFetch(parsed);
        case 'axios':  return toAxios(parsed);
        case 'python': return toPython(parsed);
        case 'node':   return toNode(parsed);
      }
    } catch { return '// Error generating code — check the cURL command.' }
  }, [parsed, lang]);

  const hasError = input.trim() && !parsed;

  return (
    <div className="space-y-4 sm:space-y-6">
      <ToolCard title="cURL command" action={
        <button onClick={() => setInput(SAMPLE)} className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]">
          Load sample
        </button>
      }>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'curl https://api.example.com -H "Authorization: Bearer TOKEN"'}
          className={`w-full min-h-[140px] font-mono text-sm p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-50 ${hasError ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-emerald-400'}`}
        />
        {hasError && <p className="mt-1 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1">Could not parse cURL command. Make sure it starts with <code className="font-mono">curl</code>.</p>}
      </ToolCard>

      {/* Parsed summary */}
      {parsed && (
        <ToolCard title="Parsed">
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="font-mono px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">{parsed.method}</span>
            <span className="font-mono px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700 break-all">{parsed.url}</span>
            {Object.entries(parsed.headers).map(([k, v]) => (
              <span key={k} className="font-mono px-2 py-1 rounded bg-sky-50 border border-sky-200 text-sky-700">{k}: {v}</span>
            ))}
            {parsed.body && <span className="font-mono px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700 break-all">body: {parsed.body}</span>}
          </div>
        </ToolCard>
      )}

      {/* Language tabs + output */}
      {parsed && (
        <ToolCard
          title="Generated code"
          action={<CopyButton value={output} />}
        >
          <div className="flex gap-1 mb-3">
            {LANGS.map(({ key, label }) => (
              <button key={key} onClick={() => setLang(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border min-h-[36px] transition-colors ${lang === key ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                {label}
              </button>
            ))}
          </div>
          <pre className="font-mono text-sm bg-slate-50 rounded-lg border border-slate-200 p-3 whitespace-pre-wrap break-words overflow-x-auto">{output}</pre>
        </ToolCard>
      )}
    </div>
  );
}
