import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'praesent', 'fermentum',
  'tellus', 'morbi', 'porta', 'tempus', 'eros', 'fringilla', 'erat', 'cursus',
  'nullam', 'ornare', 'lectus', 'mauris', 'tincidunt', 'rhoncus', 'aenean',
  'pretium', 'lacus', 'pellentesque', 'volutpat', 'metus', 'placerat',
];

const HACKER_WORDS = [
  'algorithm', 'binary', 'compile', 'debug', 'encrypt', 'firewall', 'gateway',
  'heuristic', 'iterate', 'kernel', 'latency', 'mainframe', 'namespace', 'opcode',
  'pipeline', 'quantum', 'recursive', 'syntax', 'thread', 'unicode', 'virtual',
  'webhook', 'xenon', 'yield', 'zero', 'array', 'buffer', 'cache', 'daemon',
  'endpoint', 'function', 'gradient', 'hashmap', 'index', 'json', 'lambda',
  'middleware', 'node', 'object', 'pointer', 'queue', 'runtime', 'socket',
];

type Source = 'lorem' | 'hacker';
type Unit = 'paragraphs' | 'sentences' | 'words';

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWord(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)];
}

function generateSentence(words: string[]): string {
  const length = rand(6, 15);
  const sentence: string[] = [];
  for (let i = 0; i < length; i++) sentence.push(pickWord(words));
  // capitalize first
  sentence[0] = sentence[0][0].toUpperCase() + sentence[0].slice(1);
  // add commas occasionally
  if (length > 8) {
    const commaPos = rand(3, length - 3);
    sentence[commaPos] = sentence[commaPos] + ',';
  }
  return sentence.join(' ') + '.';
}

function generateParagraph(words: string[]): string {
  const numSentences = rand(4, 7);
  const sentences: string[] = [];
  for (let i = 0; i < numSentences; i++) sentences.push(generateSentence(words));
  return sentences.join(' ');
}

function generate(source: Source, unit: Unit, count: number, startWithLorem: boolean): string {
  const words = source === 'lorem' ? WORDS : HACKER_WORDS;
  if (unit === 'paragraphs') {
    const paragraphs: string[] = [];
    for (let i = 0; i < count; i++) {
      let para = generateParagraph(words);
      if (i === 0 && startWithLorem && source === 'lorem') {
        para =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
          generateParagraph(words);
      }
      paragraphs.push(para);
    }
    return paragraphs.join('\n\n');
  }
  if (unit === 'sentences') {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) sentences.push(generateSentence(words));
    if (startWithLorem && source === 'lorem') {
      sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    }
    return sentences.join(' ');
  }
  // words
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(pickWord(words));
  out[0] = out[0][0].toUpperCase() + out[0].slice(1);
  if (startWithLorem && source === 'lorem') {
    const intro = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
    return intro.concat(out.slice(intro.length)).join(' ') + '.';
  }
  return out.join(' ') + '.';
}

export default function LoremIpsum() {
  const [source, setSource] = useState<Source>('lorem');
  const [unit, setUnit] = useState<Unit>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [seed, setSeed] = useState(0);

  const output = useMemo(
    () => generate(source, unit, count, startWithLorem),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [source, unit, count, startWithLorem, seed]
  );

  return (
    <div className="space-y-5">
      <ToolCard title="Options">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Source
            </label>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 w-full">
              {(['lorem', 'hacker'] as Source[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSource(s)}
                  className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
                    source === s ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s === 'lorem' ? 'Classic Lorem' : 'Tech / Hacker'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Unit
            </label>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 w-full">
              {(['paragraphs', 'sentences', 'words'] as Unit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-all capitalize ${
                    unit === u ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Count: {count}
            </label>
            <input
              type="range"
              min={1}
              max={unit === 'words' ? 200 : unit === 'sentences' ? 30 : 10}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                disabled={source !== 'lorem'}
              />
              <span className={source !== 'lorem' ? 'opacity-40' : ''}>
                Start with &quot;Lorem ipsum…&quot;
              </span>
            </label>
          </div>
        </div>
      </ToolCard>

      <ToolCard
        title="Generated text"
        action={
          <>
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </button>
            <CopyButton value={output} />
          </>
        }
      >
        <textarea
          value={output}
          readOnly
          className="w-full h-96 lg:h-[38rem] px-4 py-3 text-[15px] bg-slate-50 border border-slate-200 rounded-lg resize-none text-slate-800 leading-relaxed"
          spellCheck={false}
        />
      </ToolCard>
    </div>
  );
}
