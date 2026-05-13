import React, { useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const SAMPLE = `select u.id, u.email, count(o.id) as order_count from users u left join orders o on o.user_id = u.id where u.created_at > '2025-01-01' and u.status = 'active' group by u.id, u.email having count(o.id) > 5 order by order_count desc limit 25;`;

const KEYWORDS_TOP = [
  'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'WITH', 'UNION', 'UNION ALL',
  'INTERSECT', 'EXCEPT', 'RETURNING',
];
const JOIN_KEYWORDS = [
  'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'FULL JOIN',
  'CROSS JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'JOIN',
];
const INLINE_KEYWORDS = [
  'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
  'AS', 'ON', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DISTINCT', 'ASC', 'DESC',
  'TRUE', 'FALSE', 'NULL', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'CAST',
];

function format(input: string, indent: string, uppercase: boolean): string {
  if (!input.trim()) return '';

  let sql = input.replace(/\s+/g, ' ').trim();

  // Protect string literals so we don't break them
  const literals: string[] = [];
  sql = sql.replace(/'[^']*'/g, (m) => {
    literals.push(m);
    return `__LIT${literals.length - 1}__`;
  });

  // Normalize keyword casing (top-level + joins + inline)
  const allKeywords = [...KEYWORDS_TOP, ...JOIN_KEYWORDS, ...INLINE_KEYWORDS]
    .sort((a, b) => b.length - a.length);
  for (const kw of allKeywords) {
    const re = new RegExp(`\\b${kw.replace(/ /g, '\\s+')}\\b`, 'gi');
    sql = sql.replace(re, uppercase ? kw : kw.toLowerCase());
  }

  // Insert newlines before each top-level keyword
  for (const kw of [...KEYWORDS_TOP, ...JOIN_KEYWORDS]) {
    const variant = uppercase ? kw : kw.toLowerCase();
    const re = new RegExp(`\\s+${variant.replace(/ /g, '\\s+')}\\b`, 'g');
    sql = sql.replace(re, `\n${variant}`);
  }

  // Newline after commas at top-level (basic, doesn't track parens depth elegantly)
  let out = '';
  let depth = 0;
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    out += ch;
    if (ch === ',' && depth === 0) {
      // skip following spaces
      while (i + 1 < sql.length && sql[i + 1] === ' ') i++;
      out += '\n' + indent;
    }
  }

  // Indent continuation lines
  const lines = out.split('\n').map((l) => l.trim());
  const formatted = lines
    .map((line) => {
      const upperLine = line.toUpperCase();
      const isTop = KEYWORDS_TOP.some((k) => upperLine.startsWith(k));
      const isJoin = JOIN_KEYWORDS.some((k) => upperLine.startsWith(k));
      if (isTop || isJoin) return line;
      return indent + line;
    })
    .filter((l) => l.trim().length > 0)
    .join('\n');

  // Restore literals
  return formatted.replace(/__LIT(\d+)__/g, (_, n) => literals[parseInt(n, 10)] ?? _);
}

function minify(input: string): string {
  if (!input.trim()) return '';
  // Preserve string literals
  const literals: string[] = [];
  let s = input.replace(/'[^']*'/g, (m) => {
    literals.push(m);
    return `__LIT${literals.length - 1}__`;
  });
  s = s.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s.replace(/__LIT(\d+)__/g, (_, n) => literals[parseInt(n, 10)] ?? _);
}

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [uppercase, setUppercase] = useState(true);

  const formatted = useMemo(
    () => format(input, ' '.repeat(indent), uppercase),
    [input, indent, uppercase],
  );
  const minified = useMemo(() => minify(input), [input]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          Indent
          <select
            value={indent}
            onChange={(e) => setIndent(parseInt(e.target.value, 10))}
            className="text-sm px-2 py-1 border border-slate-200 rounded bg-white"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>tab (8)</option>
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Uppercase keywords
        </label>
        <button
          type="button"
          onClick={() => setInput(SAMPLE)}
          className="ml-auto text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-50"
        >
          Load sample
        </button>
        <button
          type="button"
          onClick={() => setInput('')}
          disabled={!input}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 disabled:opacity-40"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ToolCard title="SQL input" action={<span className="text-[11px] text-slate-400 font-medium">{input.length} chars</span>}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query…"
            spellCheck={false}
            className="w-full h-72 lg:h-96 px-4 py-3 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          />
        </ToolCard>

        <ToolCard title="Formatted" action={<CopyButton value={formatted} disabled={!formatted} />}>
          <pre className="h-72 lg:h-96 px-4 py-3 text-[13px] sm:text-sm font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre overflow-auto">
            {formatted || <span className="text-slate-400">Formatted SQL will appear here…</span>}
          </pre>
        </ToolCard>
      </div>

      <ToolCard title="Minified (single line)" action={<CopyButton value={minified} disabled={!minified} />}>
        <code className="block min-h-[56px] px-4 py-3 text-[13px] sm:text-sm font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg break-all">
          {minified || <span className="text-slate-400">Single-line output will appear here…</span>}
        </code>
      </ToolCard>
    </div>
  );
}
