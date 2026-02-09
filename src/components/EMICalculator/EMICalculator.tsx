import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { useEMI } from '../../hooks/useEMI';
import { Prepayment } from './EMICalculator.types';
import { validateLoanInputs } from '../../utils/validation';
import { exportToExcel } from '../../utils/excel';
import AdSlot from '../AdSlot/AdSlot';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface CalculationHistory {
  id: string;
  timestamp: number;
  loanAmount: number;
  annualRate: number;
  tenureYears: number;
  prepayments: Prepayment[];
  emi: number;
  totalInterest: number;
  interestSaved: number;
  actualTenure: number;
}

const EMICalculator: React.FC = () => {
  const { emi, schedule, summary, calculate } = useEMI();
  const [loanAmount, setLoanAmount] = useState<string>('5000000');
  const [annualRate, setAnnualRate] = useState<string>('8.5');
  const [tenureYears, setTenureYears] = useState<string>('20');
  const [prepayments, setPrepayments] = useState<Prepayment[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  // New prepayment form
  const [newPrepaymentMonth, setNewPrepaymentMonth] = useState<string>('');
  const [newPrepaymentAmount, setNewPrepaymentAmount] = useState<string>('');
  const [newPrepaymentDescription, setNewPrepaymentDescription] = useState<string>('');
  const [prepaymentFrequency, setPrepaymentFrequency] = useState<'one-time' | 'monthly' | 'quarterly' | 'yearly'>('one-time');
  const [prepaymentStartMonth, setPrepaymentStartMonth] = useState<string>('');
  const [prepaymentStrategy, setPrepaymentStrategy] = useState<'reduce-tenure' | 'reduce-emi'>('reduce-tenure');

  // Load from localStorage on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const savedState = localStorage.getItem('emi-calculator-state');
    const savedHistory = localStorage.getItem('emi-calculator-history');
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setLoanAmount(parsed.loanAmount || '5000000');
        setAnnualRate(parsed.annualRate || '8.5');
        setTenureYears(parsed.tenureYears || '20');
        setPrepayments(parsed.prepayments || []);
        calculate(
          parseFloat(parsed.loanAmount || '5000000'),
          parseFloat(parsed.annualRate || '8.5'),
          parseFloat(parsed.tenureYears || '20'),
          parsed.prepayments || []
        );
      } catch (e) {
        calculate(5000000, 8.5, 20, []);
      }
    } else {
      calculate(5000000, 8.5, 20, []);
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const state = { loanAmount, annualRate, tenureYears, prepayments };
    localStorage.setItem('emi-calculator-state', JSON.stringify(state));
  }, [loanAmount, annualRate, tenureYears, prepayments]);

  // Auto-recalculate when prepayments change
  useEffect(() => {
    if (loanAmount && annualRate && tenureYears) {
      const amount = parseFloat(loanAmount);
      const rate = parseFloat(annualRate);
      const tenure = parseFloat(tenureYears);
      if (!isNaN(amount) && !isNaN(rate) && !isNaN(tenure) && amount > 0 && rate > 0 && tenure > 0) {
        calculate(amount, rate, tenure, prepayments);
      }
    }
  }, [loanAmount, annualRate, tenureYears, prepayments, calculate]);

  const handleCalculate = () => {
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(annualRate);
    const tenure = parseFloat(tenureYears);

    const validation = validateLoanInputs(amount, rate, tenure);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    calculate(amount, rate, tenure, prepayments);
    
    // Save to history after calculation completes
    setTimeout(() => {
      if (emi > 0 && summary) {
        const historyItem: CalculationHistory = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          loanAmount: amount,
          annualRate: rate,
          tenureYears: tenure,
          prepayments: [...prepayments],
          emi,
          totalInterest: summary.totalInterest,
          interestSaved: summary.interestSaved,
          actualTenure: summary.actualTenure
        };
        const newHistory = [historyItem, ...history].slice(0, 10); // Keep last 10
        setHistory(newHistory);
        localStorage.setItem('emi-calculator-history', JSON.stringify(newHistory));
      }
    }, 100);
  };

  const handleLoadHistory = (item: CalculationHistory) => {
    setLoanAmount(item.loanAmount.toString());
    setAnnualRate(item.annualRate.toString());
    setTenureYears(item.tenureYears.toString());
    setPrepayments(item.prepayments);
    calculate(item.loanAmount, item.annualRate, item.tenureYears, item.prepayments);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('emi-calculator-history');
  };

  const handleAddPrepayment = () => {
    if (prepaymentFrequency === 'one-time') {
      const month = parseInt(newPrepaymentMonth);
      const amount = parseFloat(newPrepaymentAmount);
      
      if (month > 0 && amount > 0) {
        const newPrepayment: Prepayment = {
          id: Date.now().toString(),
          month,
          amount,
          description: newPrepaymentDescription || `One-time at M${month}`,
          strategy: prepaymentStrategy
        };
        setPrepayments([...prepayments, newPrepayment].sort((a, b) => a.month - b.month));
        setNewPrepaymentMonth('');
        setNewPrepaymentAmount('');
        setNewPrepaymentDescription('');
      }
    } else {
      // Handle recurring prepayments
      const startMonth = parseInt(prepaymentStartMonth);
      const amount = parseFloat(newPrepaymentAmount);
      const tenure = parseInt(tenureYears) * 12;
      
      if (startMonth > 0 && amount > 0) {
        const newPrepayments: Prepayment[] = [];
        const interval = prepaymentFrequency === 'monthly' ? 1 : prepaymentFrequency === 'quarterly' ? 3 : 12;
        
        for (let month = startMonth; month <= tenure; month += interval) {
          newPrepayments.push({
            id: `${Date.now()}-${month}`,
            month,
            amount,
            description: `${prepaymentFrequency} - ${prepaymentStrategy === 'reduce-tenure' ? 'Reduce Tenure' : 'Reduce EMI'}`,
            strategy: prepaymentStrategy
          });
        }
        
        setPrepayments([...prepayments, ...newPrepayments].sort((a, b) => a.month - b.month));
        setPrepaymentStartMonth('');
        setNewPrepaymentAmount('');
        setNewPrepaymentDescription('');
      }
    }
  };

  const handleRemovePrepayment = (id: string) => {
    setPrepayments(prepayments.filter(p => p.id !== id));
  };

  const handleExport = () => {
    if (schedule.length > 0) {
      exportToExcel(schedule, 'emi_amortization_schedule.xlsx');
    }
  };

  const handleReset = () => {
    setLoanAmount('5000000');
    setAnnualRate('8.5');
    setTenureYears('20');
    setPrepayments([]);
    setErrors([]);
    setNewPrepaymentMonth('');
    setNewPrepaymentAmount('');
    setNewPrepaymentDescription('');
    setPrepaymentFrequency('one-time');
    setPrepaymentStartMonth('');
    setPrepaymentStrategy('reduce-tenure');
    calculate(5000000, 8.5, 20, []);
  };

  // Chart data preparation
  const getChartData = () => {
    if (schedule.length === 0) return null;

    const labels = schedule.map(p => `M${p.month}`);
    const principalData = schedule.map(p => p.principal);
    const interestData = schedule.map(p => p.interest);
    const balanceData = schedule.map(p => p.remainingBalance);

    const skipFactor = Math.ceil(schedule.length / 24);

    return {
      lineChart: {
        labels: labels.filter((_, i) => i % skipFactor === 0),
        datasets: [
          {
            label: 'Outstanding Balance',
            data: balanceData.filter((_, i) => i % skipFactor === 0),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      stackedLineChart: {
        labels: labels.filter((_, i) => i % skipFactor === 0),
        datasets: [
          {
            label: 'Principal',
            data: principalData.filter((_, i) => i % skipFactor === 0),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            fill: true
          },
          {
            label: 'Interest',
            data: interestData.filter((_, i) => i % skipFactor === 0),
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.7)',
            fill: true
          }
        ]
      },
      pieChart: {
        labels: ['Principal', 'Interest'],
        datasets: [
          {
            data: [
              parseFloat(loanAmount),
              summary?.totalInterest || 0
            ],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(249, 115, 22, 0.8)'
            ],
            borderColor: [
              'rgba(34, 197, 94, 1)',
              'rgba(249, 115, 22, 1)'
            ],
            borderWidth: 2
          }
        ]
      },
      barChart: (() => {
        const numYears = Math.ceil(schedule.length / 12);
        const yearlyP: number[] = [];
        const yearlyI: number[] = [];
        const yLabels: string[] = [];
        for (let y = 0; y < numYears; y++) {
          const yearPayments = schedule.slice(y * 12, (y + 1) * 12);
          yearlyP.push(yearPayments.reduce((s, p) => s + p.principal, 0));
          yearlyI.push(yearPayments.reduce((s, p) => s + p.interest, 0));
          yLabels.push(`Y${y + 1}`);
        }
        return {
          labels: yLabels,
          datasets: [
            { label: 'Principal', data: yearlyP, backgroundColor: 'rgba(34, 197, 94, 0.8)' },
            { label: 'Interest', data: yearlyI, backgroundColor: 'rgba(249, 115, 22, 0.8)' }
          ]
        };
      })(),
      cumulativeChart: (() => {
        let cumP = 0, cumI = 0;
        const cumPrincipal = principalData.map(v => { cumP += v; return cumP; });
        const cumInterest = interestData.map(v => { cumI += v; return cumI; });
        return {
          labels: labels.filter((_, i) => i % skipFactor === 0),
          datasets: [
            {
              label: 'Cumulative Principal',
              data: cumPrincipal.filter((_, i) => i % skipFactor === 0),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Cumulative Interest',
              data: cumInterest.filter((_, i) => i % skipFactor === 0),
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        };
      })()
    };
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-3 px-4">
      <article className="max-w-7xl mx-auto" itemScope itemType="https://schema.org/WebApplication">
        <header className="text-center mb-4" id="calculator">
          <h1 className="text-3xl font-bold text-gray-900 mb-1" itemProp="name">
            EMI Calculator for Home Loan, Car Loan & Personal Loan
          </h1>
          <p className="text-sm text-gray-600" itemProp="description">
            Free Advanced Loan EMI Calculator with Prepayment Impact Analysis — Reduce EMI vs Reduce Tenure Comparison
          </p>
          <meta itemProp="applicationCategory" content="FinanceApplication" />
          <meta itemProp="operatingSystem" content="Any" />
        </header>

        {/* Compact Input Sections in Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Loan Details - Compact */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">1</span>
              Loan Details
            </h2>
            
            {errors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                <p className="font-bold">Errors:</p>
                <ul className="list-disc list-inside mt-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="5000000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ₹{parseFloat(loanAmount || '0').toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="8.5"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">
                  Tenure (Years)
                </label>
                <input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="20"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md text-sm"
              >
                Calculate EMI
              </button>
              <button
                onClick={handleReset}
                className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg transition duration-200 text-sm"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Prepayments - Compact */}
          <section className="bg-white rounded-xl shadow-lg p-6" id="prepayment-calculator">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-green-100 text-green-600 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">2</span>
              Loan Prepayment Calculator
            </h2>

            <div className="mb-3">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Frequency</label>
              <div className="grid grid-cols-4 gap-2">
                {(['one-time', 'monthly', 'quarterly', 'yearly'] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setPrepaymentFrequency(freq)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition ${
                      prepaymentFrequency === freq
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {freq === 'one-time' ? 'One-time' : freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Strategy</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPrepaymentStrategy('reduce-tenure')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    prepaymentStrategy === 'reduce-tenure'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🎯 Reduce Tenure
                </button>
                <button
                  onClick={() => setPrepaymentStrategy('reduce-emi')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    prepaymentStrategy === 'reduce-emi'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💰 Reduce EMI
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {prepaymentFrequency === 'one-time' ? (
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-xs">Month #</label>
                  <input
                    type="number"
                    value={newPrepaymentMonth}
                    onChange={(e) => setNewPrepaymentMonth(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                    placeholder="12"
                    min="1"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-xs">Start Month</label>
                  <input
                    type="number"
                    value={prepaymentStartMonth}
                    onChange={(e) => setPrepaymentStartMonth(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                    placeholder="12"
                    min="1"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-xs">Amount (₹)</label>
                <input
                  type="number"
                  value={newPrepaymentAmount}
                  onChange={(e) => setNewPrepaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                  placeholder="50000"
                  min="0"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddPrepayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md text-sm"
                >
                  + Add
                </button>
              </div>
            </div>

            {prepayments.length > 0 && (
              <div className="max-h-32 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-700 mb-2">Scheduled ({prepayments.length}):</p>
                <div className="space-y-1">
                  {prepayments.slice(0, 3).map((prep) => (
                    <div key={prep.id} className="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-green-200 text-xs">
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800">
                          M{prep.month}: ₹{prep.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="ml-2 text-gray-600 text-xs">
                          {prep.strategy === 'reduce-tenure' ? '🎯' : '💰'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemovePrepayment(prep.id)}
                        className="ml-2 text-red-600 hover:text-red-800 font-semibold text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {prepayments.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">+{prepayments.length - 3} more</p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Results Section */}
        {emi > 0 && summary && (
          <>
            {/* Summary Cards - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white">
                <p className="text-blue-100 mb-1 text-xs font-semibold">Monthly EMI</p>
                <p className="text-3xl font-bold">₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white">
                <p className="text-green-100 mb-1 text-xs font-semibold">Total Interest</p>
                <p className="text-3xl font-bold">₹{summary.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
                <p className="text-purple-100 mb-1 text-xs font-semibold">Total Amount</p>
                <p className="text-3xl font-bold">₹{summary.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 text-white">
                <p className="text-orange-100 mb-1 text-xs font-semibold">Interest Saved</p>
                <p className="text-3xl font-bold">₹{summary.interestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                {summary.interestSaved > 0 && (
                  <p className="text-orange-100 text-xs mt-1">
                    Loan done in {summary.actualTenure} months (saved {(parseInt(tenureYears) * 12) - summary.actualTenure})
                  </p>
                )}
              </div>
            </div>

            {/* Prepayment Impact Analysis */}
            {summary.prepaymentImpacts && summary.prepaymentImpacts.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-xl p-5 mb-6 text-white">
                <h3 className="text-xl font-bold mb-4">📊 Prepayment Impact Analysis</h3>
                
                {/* Cumulative Impact Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-white/80 text-xs mb-1">Total Prepayments</p>
                    <p className="text-2xl font-bold">{summary.prepaymentImpacts.length}</p>
                    <p className="text-white/80 text-xs">payments made</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/80 text-xs mb-1">Total Interest Saved</p>
                    <p className="text-2xl font-bold">
                      ₹{summary.interestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-white/80 text-xs">exact savings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/80 text-xs mb-1">Total Months Saved</p>
                    <p className="text-2xl font-bold">
                      {(parseInt(tenureYears) * 12) - summary.actualTenure}
                    </p>
                    <p className="text-white/80 text-xs">{summary.actualTenure} months actual vs {parseInt(tenureYears) * 12} original</p>
                  </div>
                </div>

                {/* Completion Date Message */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-5 border-2 border-white/30">
                  <p className="text-lg font-bold mb-2">🎉 Awesome! Your loan will be completed in:</p>
                  <p className="text-3xl font-bold mb-2">
                    {Math.floor(summary.actualTenure / 12)} years {summary.actualTenure % 12} months
                  </p>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {(() => {
                      const today = new Date();
                      const completionDate = new Date(today.getFullYear(), today.getMonth() + summary.actualTenure, today.getDate());
                      const monthsSaved = (parseInt(tenureYears) * 12) - summary.actualTenure;
                      const hasReduceEMI = summary.prepaymentImpacts.some(p => p.strategy === 'reduce-emi');
                      const hasReduceTenure = summary.prepaymentImpacts.some(p => p.strategy === 'reduce-tenure');
                      const allReduceEMI = summary.prepaymentImpacts.length > 0 && summary.prepaymentImpacts.every(p => p.strategy === 'reduce-emi');
                      
                      return (
                        <>
                          Expected completion: <span className="font-bold">{completionDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                          <br />
                          {monthsSaved > 0 ? (
                            <>
                              You're saving <span className="font-bold">{monthsSaved} months</span> from your original {parseInt(tenureYears) * 12}-month tenure!
                              {allReduceEMI && (
                                <>
                                  <br />
                                  💡 <em>With EMI reduction strategy: Although the tenure doesn't decrease with each prepayment, your disciplined prepayments reduce the principal faster. This completes your loan <span className="font-bold">{monthsSaved} months earlier</span> than the original schedule!</em>
                                </>
                              )}
                              {hasReduceEMI && hasReduceTenure && (
                                <>
                                  <br />
                                  💡 <em>You're using a mix of strategies - some prepayments reduce tenure directly, others reduce EMI but collectively accelerate loan completion!</em>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {allReduceEMI ? (
                                <>
                                  💰 <strong>EMI Reduction Strategy:</strong> With this approach, your <span className="font-bold">monthly EMI burden is reduced from ₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })} to lower amounts</span> after each prepayment.
                                  <br />
                                  The loan tenure remains at {parseInt(tenureYears)} years, but you enjoy <span className="font-bold">lower monthly payments</span> throughout, giving you more cash flow flexibility!
                                </>
                              ) : (
                                <>Original {parseInt(tenureYears) * 12}-month tenure maintained.</>
                              )}
                            </>
                          )}
                        </>
                      );
                    })()}
                  </p>
                </div>

                {/* Individual Impact Table */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 overflow-x-auto max-h-80 overflow-y-auto">
                  <h4 className="text-base font-bold mb-3 sticky top-0">Individual Prepayment Impacts</h4>
                  <table className="min-w-full text-xs">
                    <thead className="border-b border-white/20 sticky top-8 bg-white/5">
                      <tr>
                        <th className="px-3 py-2 text-left text-white/90">#</th>
                        <th className="px-3 py-2 text-left text-white/90">Month</th>
                        <th className="px-3 py-2 text-left text-white/90">Amount</th>
                        <th className="px-3 py-2 text-left text-white/90">Strategy</th>
                        <th className="px-3 py-2 text-left text-white/90">Old EMI</th>
                        <th className="px-3 py-2 text-left text-white/90">New EMI</th>
                        <th className="px-3 py-2 text-left text-white/90">Old Months</th>
                        <th className="px-3 py-2 text-left text-white/90">New Months</th>
                        <th className="px-3 py-2 text-left text-white/90">Interest Saved</th>
                        <th className="px-3 py-2 text-left text-white/90">Cum. Saved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.prepaymentImpacts.map((impact, index) => (
                        <tr key={impact.prepaymentId} className="border-b border-white/10 hover:bg-white/5">
                          <td className="px-3 py-2 font-semibold">{index + 1}</td>
                          <td className="px-3 py-2">M{impact.prepaymentMonth}</td>
                          <td className="px-3 py-2 font-semibold">₹{impact.prepaymentAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              impact.strategy === 'reduce-tenure' 
                                ? 'bg-blue-500/30 text-blue-100' 
                                : 'bg-green-500/30 text-green-100'
                            }`}>
                              {impact.strategy === 'reduce-tenure' ? '🎯 Tenure' : '💰 EMI'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-white/80">
                            ₹{impact.oldEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-3 py-2 font-semibold">
                            {impact.newEMI > 0
                              ? `₹${impact.newEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                              : '✅ Paid off'}
                          </td>
                          <td className="px-3 py-2 text-white/80">{impact.oldRemainingMonths}</td>
                          <td className="px-3 py-2 font-semibold">
                            {impact.newRemainingMonths === 0 ? '✅ Done' : impact.newRemainingMonths}
                          </td>
                          <td className="px-3 py-2 text-green-200 font-semibold">
                            ₹{impact.interestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-3 py-2 font-bold text-yellow-200">
                            ₹{impact.cumulativeInterestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Charts Grid */}
            {chartData && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Pie Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Loan Breakdown</h3>
                    <div className="h-48">
                      <Doughnut 
                        data={chartData.pieChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: { font: { size: 11 } }
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.label || '';
                                  const value = context.parsed;
                                  return `${label}: ₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Balance Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-4 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Outstanding Balance</h3>
                    <div className="h-48">
                      <Line 
                        data={chartData.lineChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const value = context.parsed.y ?? 0;
                                  return `Balance: ₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return '₹' + (value as number).toLocaleString('en-IN', { maximumFractionDigits: 0 });
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Stacked Area Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Principal vs Interest</h3>
                    <div className="h-64">
                      <Line 
                        data={chartData.stackedLineChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'top', labels: { font: { size: 11 } } },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.dataset.label || '';
                                  const value = context.parsed.y ?? 0;
                                  return `${label}: ₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              stacked: true,
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return '₹' + (value as number).toLocaleString('en-IN', { maximumFractionDigits: 0 });
                                }
                              }
                            },
                            x: { stacked: true }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Yearly Payment Breakdown</h3>
                    <div className="h-64">
                      <Bar 
                        data={chartData.barChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'top', labels: { font: { size: 11 } } },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.dataset.label || '';
                                  const value = context.parsed.y ?? 0;
                                  return `${label}: ₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
                                }
                              }
                            }
                          },
                          scales: {
                            x: { stacked: true },
                            y: {
                              stacked: true,
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return '₹' + (value as number).toLocaleString('en-IN', { maximumFractionDigits: 0 });
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Cumulative Chart */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Cumulative Payment Analysis</h3>
                  <div className="h-64">
                    <Line 
                      data={chartData.cumulativeChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y ?? 0;
                                return `${label}: ₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return '₹' + (value as number).toLocaleString('en-IN', { maximumFractionDigits: 0 });
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Advanced Analytics - Year-wise Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Year-wise Interest Breakdown */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Interest Paid Per Year</h3>
                    <div className="h-64">
                      <Line 
                        data={(() => {
                          const numYears = Math.ceil(schedule.length / 12);
                          const yearlyInterest: number[] = [];
                          const yLabels: string[] = [];
                          for (let y = 0; y < numYears; y++) {
                            const yearPayments = schedule.slice(y * 12, (y + 1) * 12);
                            yearlyInterest.push(yearPayments.reduce((s, p) => s + p.interest, 0));
                            yLabels.push(`Year ${y + 1}`);
                          }
                          return {
                            labels: yLabels,
                            datasets: [{
                              label: 'Interest Paid',
                              data: yearlyInterest,
                              borderColor: 'rgb(239, 68, 68)',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              fill: true,
                              tension: 0.4
                            }]
                          };
                        })()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const value = context.parsed.y ?? 0;
                                  return `Interest: ₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return '₹' + (value as number).toLocaleString('en-IN', { maximumFractionDigits: 0 });
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Monthly Payment Composition */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Payment Composition Over Time</h3>
                    <div className="h-64">
                      <Line 
                        data={(() => {
                          const skipFactor = Math.ceil(schedule.length / 24);
                          const labels = schedule.map(p => `M${p.month}`).filter((_, i) => i % skipFactor === 0);
                          const principalPct = schedule.filter((_, i) => i % skipFactor === 0).map(p => {
                            const total = p.principal + p.interest;
                            return total > 0 ? (p.principal / total) * 100 : 0;
                          });
                          const interestPct = principalPct.map(p => 100 - p);
                          return {
                            labels,
                            datasets: [
                              {
                                label: 'Principal %',
                                data: principalPct,
                                borderColor: 'rgb(34, 197, 94)',
                                backgroundColor: 'rgba(34, 197, 94, 0.3)',
                                fill: true,
                                tension: 0.4
                              },
                              {
                                label: 'Interest %',
                                data: interestPct,
                                borderColor: 'rgb(249, 115, 22)',
                                backgroundColor: 'rgba(249, 115, 22, 0.3)',
                                fill: true,
                                tension: 0.4
                              }
                            ]
                          };
                        })()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'top', labels: { font: { size: 11 } } },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `${context.dataset.label}: ${(context.parsed.y ?? 0).toFixed(1)}%`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                callback: function(value) {
                                  return value + '%';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Prepayment Impact Visualization */}
                {prepayments.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Prepayment Timeline Impact</h3>
                    <div className="h-64">
                      <Bar 
                        data={{
                          labels: prepayments.slice(0, 20).map(p => `M${p.month}`),
                          datasets: [
                            {
                              label: 'Prepayment Amount',
                              data: prepayments.slice(0, 20).map(p => p.amount),
                              backgroundColor: 'rgba(99, 102, 241, 0.8)',
                              yAxisID: 'y'
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'top', labels: { font: { size: 11 } } },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return `Amount: ₹${(context.parsed.y ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              type: 'linear',
                              display: true,
                              position: 'left',
                              beginAtZero: true,
                              ticks: {
                                callback: function(value) {
                                  return '₹' + (value as number).toLocaleString('en-IN', { maximumFractionDigits: 0 });
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Export Button */}
            {schedule.length > 0 && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition duration-200 shadow-lg"
                >
                  📊 Export Complete Schedule to Excel
                </button>
              </div>
            )}

            {/* Compact Amortization Table */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Schedule (First 12 Months)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">EMI</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Principal</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Interest</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Prepay</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedule.slice(0, 12).map((payment) => (
                      <tr 
                        key={payment.month} 
                        className={`hover:bg-blue-50 transition ${payment.prepaymentAmount ? 'bg-green-50' : ''}`}
                      >
                        <td className="px-4 py-2 whitespace-nowrap font-semibold text-gray-900">{payment.month}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                          ₹{(payment.principal + payment.interest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-green-600 font-semibold">
                          ₹{payment.principal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-orange-600">
                          ₹{payment.interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap font-bold text-green-700">
                          {payment.prepaymentAmount ? `₹${payment.prepaymentAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '-'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-900 font-semibold">
                          ₹{payment.remainingBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-center py-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Showing first 12 months of {schedule.length} total months
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">📊 Calculation History</h2>
                <div className="flex gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory(false)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No calculation history yet</p>
                    <p className="text-sm mt-2">Your calculations will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleLoadHistory(item)}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border-2 border-gray-200 hover:border-indigo-400 cursor-pointer transition shadow-sm hover:shadow-md"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              {new Date(item.timestamp).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-lg font-bold text-gray-800">
                              ₹{item.loanAmount.toLocaleString('en-IN')} @ {item.annualRate}% for {item.tenureYears} years
                            </p>
                          </div>
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                            {item.prepayments.length} prepayments
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 text-xs">Monthly EMI</p>
                            <p className="font-bold text-blue-600">₹{item.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Total Interest</p>
                            <p className="font-bold text-orange-600">₹{item.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Interest Saved</p>
                            <p className="font-bold text-green-600">₹{item.interestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Actual Tenure</p>
                            <p className="font-bold text-purple-600">{Math.floor(item.actualTenure / 12)}y {item.actualTenure % 12}m</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Button - Floating */}
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl transition duration-200 flex items-center gap-2 z-40"
          >
            📊 History ({history.length})
          </button>
        )}

        {/* In-content Ad (mobile-friendly rectangle) */}
        <div className="flex justify-center my-6 2xl:hidden">
          <AdSlot slotId="in-content-1" format="rectangle" label="In-Content Ad" />
        </div>

        {/* SEO Content Section: What is EMI */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6" id="what-is-emi">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">What is EMI?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>EMI (Equated Monthly Installment)</strong> is the fixed amount you pay every month to the bank or financial institution until the loan is fully repaid. 
            It consists of two components — the <strong>principal repayment</strong> and the <strong>interest payment</strong>. During the initial months of your loan, 
            a larger portion of your EMI goes towards paying interest. As time progresses, more of your EMI is applied towards the principal.
          </p>
          
          <h3 className="text-lg font-bold text-gray-800 mb-3">EMI Calculation Formula</h3>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
            <p className="text-gray-800 font-mono text-sm mb-2">
              <strong>EMI = P × r × (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> - 1)</strong>
            </p>
            <ul className="text-gray-700 text-sm space-y-1 mt-3">
              <li>• <strong>P</strong> = Principal Loan Amount (e.g., ₹50,00,000 for home loan)</li>
              <li>• <strong>r</strong> = Monthly Interest Rate = Annual Rate / 12 / 100 (e.g., 8.5% → 0.00708)</li>
              <li>• <strong>n</strong> = Loan Tenure in Months (e.g., 20 years = 240 months)</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed">
            For example, if you borrow <strong>₹50,00,000</strong> at <strong>8.5% annual interest</strong> for <strong>20 years (240 months)</strong>, 
            your monthly EMI would be approximately <strong>₹43,391</strong>. The total amount payable over the loan lifetime would be ₹1,04,13,842, 
            which includes ₹54,13,842 as interest.
          </p>
        </section>

        {/* SEO Content Section: Reduce EMI vs Reduce Tenure */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6" id="reduce-emi-vs-reduce-tenure">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reduce EMI vs Reduce Tenure — Which Prepayment Strategy Should You Choose?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you make a <strong>prepayment (part-payment)</strong> on your loan, banks typically offer two options for adjusting your loan. 
            Understanding the difference is crucial as it can save you lakhs of rupees in interest.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-indigo-50 rounded-xl p-5 border-2 border-indigo-200">
              <h3 className="text-lg font-bold text-indigo-800 mb-3">🎯 Reduce Tenure Strategy</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Your monthly EMI <strong>stays the same</strong>, but the loan duration <strong>decreases</strong>. This means you become debt-free faster.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start"><span className="text-green-600 mr-2 flex-shrink-0">✅</span> <span><strong>Maximum interest savings</strong> over loan lifetime</span></li>
                <li className="flex items-start"><span className="text-green-600 mr-2 flex-shrink-0">✅</span> <span>Become <strong>debt-free years earlier</strong></span></li>
                <li className="flex items-start"><span className="text-green-600 mr-2 flex-shrink-0">✅</span> <span>Requires consistent <strong>prepayment discipline</strong></span></li>
                <li className="flex items-start"><span className="text-orange-500 mr-2 flex-shrink-0">⚠️</span> <span>Monthly outflow remains unchanged</span></li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-3">💰 Reduce EMI Strategy</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Your loan tenure <strong>stays the same</strong>, but your monthly EMI <strong>decreases</strong> after the prepayment.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start"><span className="text-green-600 mr-2 flex-shrink-0">✅</span> <span><strong>Immediate cash flow relief</strong></span></li>
                <li className="flex items-start"><span className="text-green-600 mr-2 flex-shrink-0">✅</span> <span><strong>Lower monthly</strong> financial burden</span></li>
                <li className="flex items-start"><span className="text-green-600 mr-2 flex-shrink-0">✅</span> <span>Good when expecting <strong>future expenses</strong></span></li>
                <li className="flex items-start"><span className="text-orange-500 mr-2 flex-shrink-0">⚠️</span> <span>Less total interest saved vs Reduce Tenure</span></li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-gray-800 text-sm font-semibold mb-2">
              💡 How to Choose: Your decision should be based on <strong>your prepayment discipline and financial situation</strong>, not a one-size-fits-all recommendation.
            </p>

            <p className="text-gray-700 text-sm mb-3">Here are practical points to consider before you pick a strategy:</p>

            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 mb-3">
              <li><strong>Consistency:</strong> If you can commit to regular prepayments (monthly or quarterly), <strong>Reduce EMI</strong> delivers both immediate cash-flow relief and long-term principal reduction.</li>
              <li><strong>Cashflow needs:</strong> If you need breathing room today for other goals (emergency fund, education), <strong>Reduce EMI</strong> lowers your monthly burden right away.</li>
              <li><strong>One-off surplus:</strong> If you expect an occasional large lump sum (bonus, inheritance), <strong>Reduce Tenure</strong> gives the maximum interest saving for that single payment.</li>
              <li><strong>Risk tolerance:</strong> Prepaying reduces guaranteed interest costs; investing introduces market variability. Match the choice to your comfort with risk.</li>
              <li><strong>Tax considerations:</strong> Home loan tax benefits (Section 80C, 24b) affect net advantage — factor them into your plan.</li>
              <li><strong>Loan terms:</strong> Check lender rules for prepayment penalties, floating vs fixed rates, and any minimum prepayment amounts.</li>
            </ul>

            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <div className="bg-white p-3 rounded border">
                <h4 className="font-semibold text-gray-800 mb-2">When Reduce EMI shines</h4>
                <p className="text-gray-700 text-sm mb-2">If you regularly prepay and want lower monthly payments now, <strong>Reduce EMI</strong> has a powerful two‑pronged effect — it immediately reduces your EMI for better cash flow, and regular prepayments help chip away at principal so your loan ends earlier.</p>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>Dual benefit: lower EMI today + steadily shrinking principal</li>
                  <li>Better for disciplined savers who prefer improved monthly cashflow</li>
                  <li>Works well with predictable surplus (salary increments, systematic savings)</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">Suggestion: Model monthly small prepayments to see how your EMI and tenure change together.</p>
              </div>

              <div className="bg-white p-3 rounded border">
                <h4 className="font-semibold text-gray-800 mb-2">When Reduce Tenure is better</h4>
                <p className="text-gray-700 text-sm mb-2">If you cannot guarantee regular prepayments but occasionally have a lump sum to spare, <strong>Reduce Tenure</strong> often gives the largest interest saving for that one payment because it shortens the total number of EMIs.</p>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>Best for one-off windfalls (bonus, gift)</li>
                  <li>Maximizes total interest saved for isolated prepayments</li>
                  <li>Good fallback if you worry about sticking to a schedule</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">Suggestion: If unsure about discipline, model both strategies here and compare total interest and monthly impact.</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm">Quick checklist: Are your surplus flows regular? Do you value lower monthly payments today? Do you expect a lump sum in the near future? Use this checklist to guide your choice.</p>

            <p className="text-sm text-gray-600 mt-3">Friendly tip: There's no permanent right answer — you can mix strategies over time. Start with the option that fits your behavior today, re-evaluate annually, and use this calculator to preview both outcomes before you act.</p>
          </div>
        </section>

        {/* In-content Ad */}
        <div className="flex justify-center my-6 2xl:hidden">
          <AdSlot slotId="in-content-2" format="horizontal" label="Mid-Content Banner" />
        </div>

        {/* SEO Content: How to Use */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use This EMI Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
              <h3 className="font-bold text-gray-800 mb-2">Enter Loan Details</h3>
              <p className="text-gray-600 text-sm">Input your loan amount, interest rate, and tenure. Works for home loan, car loan, personal loan, or any EMI-based loan.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
              <h3 className="font-bold text-gray-800 mb-2">Add Prepayments (Optional)</h3>
              <p className="text-gray-600 text-sm">Choose one-time, monthly, quarterly, or yearly prepayments. Select Reduce Tenure or Reduce EMI strategy for each.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
              <h3 className="font-bold text-gray-800 mb-2">Analyze Results</h3>
              <p className="text-gray-600 text-sm">View 8 interactive charts, prepayment impact analysis, interest savings breakdown, and download the full amortization schedule.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section - SEO Gold Mine */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6" id="faq" itemScope itemType="https://schema.org/FAQPage">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions about EMI & Loan Prepayment</h2>
          
          {[
            {
              q: 'I\'m not sure I can prepay consistently — which strategy should I pick?',
              a: 'This is the most important question, and many borrowers get it wrong. If you\'re undisciplined about prepayments, Reduce EMI is the better choice — not Reduce Tenure. With Reduce Tenure, if you can\'t maintain prepayments, you lose out on massive interest savings. With Reduce EMI, even if you stop prepaying, your lower EMI is locked in. Honestly assess: Do you consistently save? Can you handle prepayments alongside other goals? Choose the strategy that matches your actual behavior, not your aspirations.'
            },
            {
              q: 'What is EMI and how is it calculated?',
              a: 'EMI stands for Equated Monthly Installment — the fixed amount you pay each month to repay a loan. It is calculated using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the loan amount, r is the monthly interest rate, and n is the number of months. Our calculator computes this instantly for home loans, car loans, and personal loans.'
            },
            {
              q: 'What is the difference between Reduce EMI and Reduce Tenure?',
              a: 'When you make a prepayment, Reduce Tenure keeps your EMI the same but shortens the loan duration — saving maximum interest, **but only if you maintain prepayment discipline**. Reduce EMI keeps the tenure same but lowers your monthly EMI — providing cash flow relief and is more practical if you cannot guarantee consistent prepayments. For a ₹50 lakh loan, Reduce Tenure *can* save ₹15-25 lakhs more, but this requires sticking to your prepayment plan.'
            },
            {
              q: 'How much can I save with home loan prepayments?',
              a: 'Savings depend on prepayment amount, timing, strategy, and most importantly, your ability to maintain the prepayment schedule. On a ₹50 lakh home loan at 8.5% for 20 years, quarterly prepayments of ₹1 lakh using Reduce Tenure can save over ₹20 lakhs in interest and reduce tenure by 8-10 years — but this requires consistent discipline. If you can\'t maintain prepayments, the actual savings will be much lower. Earlier prepayments save more as the outstanding principal is higher.'
            },
            {
              q: 'Should I do lump sum prepayment or regular small prepayments?',
              a: 'Both help, but regular prepayments (monthly or quarterly) are often more practical and provide consistent interest savings. A single large prepayment early in the loan has the highest impact. Use our calculator to compare different prepayment scenarios and find what works best for your budget.'
            },
            {
              q: 'How does this EMI calculator work for car loans and personal loans?',
              a: 'Our calculator works identically for all loan types — home loan, car loan, personal loan, education loan, or any fixed-rate EMI loan. Simply enter the loan amount, annual interest rate, and loan tenure. The EMI formula is the same regardless of loan type. Car loans typically have higher interest rates (8-12%) and shorter tenures (3-7 years) compared to home loans (7-9%, 15-30 years).'
            },
            {
              q: 'What are the current home loan interest rates in India?',
              a: 'As of early 2026, home loan interest rates in India range from 8.25% to 9.5%. SBI offers rates from 8.25%, HDFC from 8.35%, ICICI from 8.40%, and other banks vary. Rates depend on loan amount, borrower profile, and property type. Use our calculator to see how even a 0.5% rate difference impacts your total interest outgo.'
            },
            {
              q: 'Is it better to invest the money or prepay the home loan?',
              a: 'If your investment returns (after tax) exceed your loan interest rate, investing may be better. For example, if your home loan rate is 8.5% and equity investments give 12-15% returns, investing could be more profitable. However, loan prepayment gives guaranteed, risk-free returns equal to your interest rate — but only if you actually make the prepayments consistently. Many borrowers plan to prepay but never do, resulting in higher interest costs. Consider your prepayment discipline, risk appetite, tax benefits (Section 80C, 24b), and financial goals.'
            },
            {
              q: 'Can I make prepayments on a floating rate home loan?',
              a: 'Yes! RBI guidelines allow prepayment of floating rate home loans without any penalty. For fixed-rate loans, banks may charge a prepayment penalty of 2-3%. Floating rate borrowers should take advantage of this by making regular prepayments whenever they have surplus funds.'
            }
          ].map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-0 py-4"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2" itemProp="name">{faq.q}</h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-gray-600 leading-relaxed text-sm" itemProp="text">{faq.a}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom Ad */}
        <div className="flex justify-center my-6 2xl:hidden">
          <AdSlot slotId="bottom-banner" format="horizontal" label="Bottom Banner Ad" />
        </div>

        <footer className="text-center mt-8 mb-4 text-gray-500 text-sm">
          <p className="font-semibold">EMI Calculator Pro — India's Most Advanced Free Loan Calculator</p>
          <p className="mt-1 text-xs">Calculate EMI for Home Loan, Car Loan & Personal Loan • Compare Reduce EMI vs Reduce Tenure • Advanced Prepayment Analysis</p>
          <p className="mt-2 text-xs text-gray-400">
            Results are estimates based on the inputs provided. Actual EMI may vary based on bank processing fees, insurance, and other charges. 
            Consult a financial advisor before making loan decisions.
          </p>
          <nav className="mt-3 text-xs space-x-4">
            <a href="#calculator" className="text-blue-600 hover:underline">EMI Calculator</a>
            <a href="#prepayment-calculator" className="text-blue-600 hover:underline">Prepayment Calculator</a>
            <a href="#reduce-emi-vs-reduce-tenure" className="text-blue-600 hover:underline">Reduce EMI vs Tenure</a>
            <a href="#faq" className="text-blue-600 hover:underline">FAQ</a>
          </nav>
          <p className="mt-3 text-xs text-gray-400">© {new Date().getFullYear()} EMI Calculator Pro. All rights reserved.</p>
        </footer>
      </article>
    </div>
  );
};

export default EMICalculator;
