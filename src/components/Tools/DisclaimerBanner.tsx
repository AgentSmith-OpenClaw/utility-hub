import React from 'react';

export type DisclaimerType = 'finance' | 'health' | 'pdf' | 'tools' | 'utilities' | 'image';

const DISCLAIMER_CONFIG: Record<DisclaimerType, { text: string; icon: string; bg: string; border: string; text2: string; }> = {
  finance: {
    icon: '⚠️',
    text: 'Toolisk is a free calculator. Results are estimates based on the inputs you provide — kindly review them before making financial decisions. Always consult a qualified financial advisor for professional advice.',
    bg: 'bg-amber-50',
    border: 'border-amber-200/60',
    text2: 'text-amber-800',
  },
  health: {
    icon: '🩺',
    text: 'This tool uses generally available calculation formulas. Results are for informational purposes only — kindly consult a physician or cross-verify health information with a qualified healthcare provider.',
    bg: 'bg-violet-50',
    border: 'border-violet-200/60',
    text2: 'text-violet-800',
  },
  pdf: {
    icon: '📄',
    text: 'PDF tools process files entirely in your browser — no files are uploaded to any server. Verify output documents before using for official purposes.',
    bg: 'bg-rose-50',
    border: 'border-rose-200/60',
    text2: 'text-rose-800',
  },
  tools: {
    icon: '🔧',
    text: 'Developer tools process data locally in your browser — no data is sent to any server. Always validate output before using in production environments.',
    bg: 'bg-teal-50',
    border: 'border-teal-200/60',
    text2: 'text-teal-800',
  },
  utilities: {
    icon: '⚡',
    text: 'These utilities are provided for general informational purposes. Results should be independently verified before relying on them for decisions.',
    bg: 'bg-amber-50',
    border: 'border-amber-200/60',
    text2: 'text-amber-800',
  },
  image: {
    icon: '🖼️',
    text: 'Image processing runs entirely in your browser — no images are uploaded to any server. Output quality depends on input resolution and format.',
    bg: 'bg-sky-50',
    border: 'border-sky-200/60',
    text2: 'text-sky-800',
  },
};

interface DisclaimerBannerProps {
  type: DisclaimerType;
  className?: string;
}

export default function DisclaimerBanner({ type, className = '' }: DisclaimerBannerProps) {
  const config = DISCLAIMER_CONFIG[type];
  if (!config) return null;

  const { text, icon, bg, border, text2 } = config;

  return (
    <div className={`mt-6 rounded-lg border p-3 text-xs leading-relaxed ${bg} ${border} ${text2} ${className}`}>
      <span className="mr-1.5">{icon}</span>
      {text}
    </div>
  );
}