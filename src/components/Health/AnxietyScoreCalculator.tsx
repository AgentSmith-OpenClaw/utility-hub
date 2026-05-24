'use client';
import React, { useState, useMemo } from 'react';

const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge?',
  'Not being able to stop or control worrying?',
  'Worrying too much about different things?',
  'Trouble relaxing?',
  'Being so restless that it\'s hard to sit still?',
  'Becoming easily annoyed or irritable?',
  'Feeling afraid as if something awful might happen?',
];

const OPTION_LABELS = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

interface SeverityInfo {
  label: string;
  color: string;
  bg: string;
  border: string;
  textColor: string;
  description: string;
  nextSteps: string[];
  showCrisis: boolean;
}

function getSeverity(score: number): SeverityInfo {
  if (score <= 4) {
    return {
      label: 'Minimal Anxiety',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'Your score suggests minimal anxiety symptoms. This is a positive sign that your anxiety is well-managed at this time.',
      nextSteps: [
        'Continue maintaining healthy coping habits',
        'Practice stress-reduction techniques like deep breathing',
        'Stay connected with supportive friends and family',
        'Get regular physical activity and adequate sleep',
      ],
      showCrisis: false,
    };
  } else if (score <= 9) {
    return {
      label: 'Mild Anxiety',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'Your score suggests mild anxiety. While not severe, these symptoms may benefit from some self-care strategies or professional support.',
      nextSteps: [
        'Try relaxation techniques such as progressive muscle relaxation',
        'Consider speaking with a counselor or therapist',
        'Reduce caffeine and alcohol intake',
        'Practice mindfulness or meditation for 10–15 minutes daily',
        'Ensure you\'re getting regular exercise and quality sleep',
      ],
      showCrisis: false,
    };
  } else if (score <= 14) {
    return {
      label: 'Moderate Anxiety',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      textColor: 'text-orange-700',
      description: 'Your score suggests moderate anxiety that may be interfering with your daily life. Reaching out to a healthcare provider is a positive step forward.',
      nextSteps: [
        'Schedule an appointment with your primary care doctor',
        'Consider a referral to a mental health specialist',
        'Explore therapy options such as CBT (Cognitive Behavioral Therapy)',
        'Learn and practice anxiety management techniques',
        'Keep a mood journal to identify triggers and patterns',
        'Reach out to trusted friends or family for support',
      ],
      showCrisis: false,
    };
  } else {
    return {
      label: 'Severe Anxiety',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      textColor: 'text-red-700',
      description: 'Your score suggests severe anxiety symptoms. Please consider reaching out to a healthcare professional as soon as possible for support and evaluation.',
      nextSteps: [
        'Contact your doctor or mental health provider promptly',
        'If you\'re having thoughts of self-harm, please seek immediate help',
        'Consider reaching out to a trusted person in your life for support',
        'Therapy and/or medication can be very effective for severe anxiety',
        'Crisis support is available 24/7 — you don\'t have to face this alone',
      ],
      showCrisis: true,
    };
  }
}

export default function AnxietyScoreCalculator() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(7).fill(null));
  const [showResults, setShowResults] = useState(false);

  const totalScore = useMemo((): number => {
    return answers.reduce((sum: number, a) => sum + (a ?? 0), 0);
  }, [answers]);

  const answeredCount = useMemo(() => {
    return answers.filter((a) => a !== null).length;
  }, [answers]);

  const allAnswered = answeredCount === 7;
  const severity = getSeverity(totalScore);

  const handleOptionSelect = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleCalculate = () => {
    if (allAnswered) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setAnswers(Array(7).fill(null));
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Your GAD-7 Score</p>
          <p className={`text-6xl font-extrabold tracking-tight ${severity.color}`}>{totalScore}</p>
          <p className="text-slate-500 text-sm mt-1">out of 21</p>
        </div>

        <div className={`rounded-xl border p-6 ${severity.bg} ${severity.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${severity.color.replace('text-', 'bg-')}`} />
            <p className={`text-lg font-bold ${severity.color}`}>{severity.label}</p>
          </div>
          <p className={`text-sm leading-relaxed ${severity.textColor}`}>{severity.description}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base font-bold text-slate-800">What Your Score Means</p>
          </div>
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
            <p>The GAD-7 is a validated screening tool for generalized anxiety disorder. It asks about anxiety symptoms over the past 2 weeks.</p>
            <ul className="space-y-1 mt-3">
              <li><span className="font-semibold text-slate-700">0–4:</span> Minimal anxiety</li>
              <li><span className="font-semibold text-slate-700">5–9:</span> Mild anxiety</li>
              <li><span className="font-semibold text-slate-700">10–14:</span> Moderate anxiety</li>
              <li><span className="font-semibold text-slate-700">15–21:</span> Severe anxiety</li>
            </ul>
            <p className="mt-3">This tool does not provide a diagnosis. Only a qualified healthcare provider can diagnose anxiety disorders.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-base font-bold text-slate-800">Recommended Next Steps</p>
          </div>
          <ul className="space-y-2">
            {severity.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {severity.showCrisis && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-base font-bold text-red-700">Crisis Resources</p>
            </div>
            <p className="text-sm text-red-700 mb-3">If you&apos;re in crisis or having thoughts of self-harm, please reach out immediately:</p>
            <ul className="space-y-2 text-sm text-red-700">
              <li className="flex items-start gap-2">
                <span className="font-semibold">National Suicide Prevention Lifeline:</span>
                <span>Call or text <a href="tel:988" className="underline font-semibold">988</a> (US)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">Crisis Text Line:</span>
                <span>Text <a href="sms:741741&body=HELLO" className="underline font-semibold">HOME</a> to 741741</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">International Association:</span>
                <span>Visit <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">findahelpline.com</a> for global resources</span>
              </li>
            </ul>
          </div>
        )}

        <div className="bg-violet-50 border border-violet-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-base font-bold text-violet-700">Mental Health Resources</p>
          </div>
          <ul className="space-y-2 text-sm text-violet-700">
            <li><a href="https://www.nami.org" target="_blank" rel="noopener noreferrer" className="underline font-semibold">NAMI (National Alliance on Mental Illness)</a> — nami.org</li>
            <li><a href="https://www.apa.org" target="_blank" rel="noopener noreferrer" className="underline font-semibold">American Psychological Association</a> — apa.org</li>
            <li><a href="https://www.anxiety.org" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Anxiety & Depression Association of America</a> — adaa.org</li>
            <li><a href="https://www.crisistextline.org" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Crisis Text Line</a> — crisistextline.org</li>
          </ul>
        </div>

        <button
          onClick={handleReset}
          className="w-full py-3 px-4 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200 hover:bg-slate-200 transition-all"
        >
          Retake the Assessment
        </button>

        <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
          This tool is for informational and screening purposes only. It is not a diagnosis. Please consult a qualified healthcare provider for personalized advice, diagnosis, or treatment.
        </p>
      </div>
    );
  }

  const remaining = 7 - answeredCount;
  const remainingLabel = remaining === 1 ? 'question' : 'questions';

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-1">GAD-7 Anxiety Assessment</p>
        <p className="text-xs text-slate-500 leading-relaxed">Over the last 2 weeks, how often have you been bothered by the following problems?</p>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">{answeredCount} of 7 answered</span>
            <span className="text-xs text-violet-600 font-semibold">{Math.round((answeredCount / 7) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / 7) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        {GAD7_QUESTIONS.map((question, qIndex) => (
          <div key={qIndex} className={qIndex > 0 ? 'pt-4 border-t border-slate-100' : ''}>
            <p className="text-sm font-medium text-slate-700 mb-3">
              <span className="text-violet-600 font-bold mr-1">{qIndex + 1}.</span>
              {question}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {OPTION_LABELS.map((label, oIndex) => {
                const isSelected = answers[qIndex] === oIndex;
                const baseClasses = 'py-2.5 px-2 rounded-lg text-xs font-medium border transition-all';
                const selectedClasses = 'bg-violet-600 text-white border-violet-600 shadow-sm';
                const defaultClasses = 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50';
                return (
                  <button
                    key={oIndex}
                    onClick={() => handleOptionSelect(qIndex, oIndex)}
                    className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleCalculate}
        disabled={!allAnswered}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-sm border transition-all ${
          allAnswered
            ? 'bg-violet-600 text-white border-violet-600 shadow-sm hover:bg-violet-700'
            : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
        }`}
      >
        {allAnswered
          ? 'Calculate My Anxiety Score'
          : `Answer all ${remaining} remaining ${remainingLabel} to continue`}
      </button>

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational and screening purposes only. It is not a diagnosis. Please consult a qualified healthcare provider for personalized advice, diagnosis, or treatment.
      </p>
    </div>
  );
}