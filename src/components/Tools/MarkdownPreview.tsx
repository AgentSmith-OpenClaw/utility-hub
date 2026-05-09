import React, { useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const SAMPLE = `# Markdown Preview

A live, dependency-free markdown renderer.

## Features

- **Headings** (H1–H6)
- *Italic* and **bold** and \`inline code\`
- [Links](https://toolisk.com)
- Lists (ordered & unordered)
- Code blocks with fenced syntax
- Blockquotes & horizontal rules

> Tip: paste your README and check rendering before you ship.

\`\`\`js
function hello(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

1. First
2. Second
3. Third
`;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text: string): string {
  let s = escapeHtml(text);
  // Inline code
  s = s.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-rose-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
  // Bold
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // Italic
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/_([^_]+)_/g, '<em>$1</em>');
  // Links: [text](url)
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-emerald-700 underline hover:text-emerald-800" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  // Images: ![alt](src)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="max-w-full rounded-lg my-2" />');
  return s;
}

function render(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let i = 0;
  let inCode = false;
  let codeLang = '';
  let codeBuf: string[] = [];
  let inList: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (inList) {
      out.push(`</${inList}>`);
      inList = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code blocks
    if (line.startsWith('```')) {
      if (inCode) {
        out.push(
          `<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-3"><code class="text-xs font-mono${
            codeLang ? ' language-' + codeLang : ''
          }">${escapeHtml(codeBuf.join('\n'))}</code></pre>`,
        );
        inCode = false;
        codeBuf = [];
        codeLang = '';
      } else {
        closeList();
        inCode = true;
        codeLang = line.slice(3).trim();
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i++;
      continue;
    }

    // HR
    if (/^(\*\*\*|---|___)\s*$/.test(line)) {
      closeList();
      out.push('<hr class="my-4 border-slate-200" />');
      i++;
      continue;
    }

    // Headings
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      closeList();
      const level = h[1].length;
      const sizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];
      out.push(`<h${level} class="font-bold text-slate-900 mt-4 mb-2 ${sizes[level - 1]}">${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      closeList();
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        buf.push(lines[i].slice(2));
        i++;
      }
      out.push(
        `<blockquote class="border-l-4 border-emerald-300 pl-4 my-3 text-slate-600 italic">${inline(buf.join(' '))}</blockquote>`,
      );
      continue;
    }

    // Unordered list
    const ul = /^[-*]\s+(.*)$/.exec(line);
    if (ul) {
      if (inList !== 'ul') {
        closeList();
        out.push('<ul class="list-disc pl-6 my-2 space-y-1">');
        inList = 'ul';
      }
      out.push(`<li>${inline(ul[1])}</li>`);
      i++;
      continue;
    }

    // Ordered list
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ol) {
      if (inList !== 'ol') {
        closeList();
        out.push('<ol class="list-decimal pl-6 my-2 space-y-1">');
        inList = 'ol';
      }
      out.push(`<li>${inline(ol[1])}</li>`);
      i++;
      continue;
    }

    // Blank line
    if (!line.trim()) {
      closeList();
      i++;
      continue;
    }

    // Paragraph (collect consecutive non-empty lines)
    closeList();
    const buf = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !lines[i].startsWith('> ') &&
      !lines[i].startsWith('```')
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p class="my-2 text-slate-700 leading-relaxed">${inline(buf.join(' '))}</p>`);
  }

  closeList();
  if (inCode) {
    out.push(`<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-3"><code class="text-xs font-mono">${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
  }
  return out.join('\n');
}

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE);
  const html = useMemo(() => render(input), [input]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setInput(SAMPLE)}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-50"
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
        <span className="ml-auto text-[11px] text-slate-400">{input.length} chars</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ToolCard title="Markdown" action={<CopyButton value={input} disabled={!input} />}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="w-full h-[60vh] px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          />
        </ToolCard>

        <ToolCard
          title="Preview"
          action={<CopyButton value={html} disabled={!html} label="Copy HTML" />}
        >
          <div
            className="h-[60vh] overflow-auto px-3 py-2.5 bg-white border border-slate-200 rounded-lg"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </ToolCard>
      </div>
    </div>
  );
}
