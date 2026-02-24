'use client';

import { useState, useMemo } from 'react';

interface EVModel {
  name: string;
  efficiency: number;
}

const evModels: EVModel[] = [
  { name: 'Tesla Model 3', efficiency: 14.5 },
  { name: 'Tesla Model Y', efficiency: 15.5 },
  { name: 'BYD Atto 3', efficiency: 17 },
  { name: 'BYD Seal', efficiency: 15 },
  { name: 'MG4', efficiency: 16 },
  { name: 'Hyundai Ioniq 5', efficiency: 18 },
  { name: 'Hyundai Ioniq 6', efficiency: 14.5 },
  { name: 'Kia EV6', efficiency: 17.5 },
];

interface RateOption {
  label: string;
  value: number;
}

const rateOptions: RateOption[] = [
  { label: 'תעריף ביתי', value: 0.65 },
  { label: 'תעריף לילה (עידוד שימוש)', value: 0.35 },
  { label: 'עמדת טעינה ציבורית', value: 2.5 },
];

const GASOLINE_CONSUMPTION = 8; // L/100km for comparison

export default function ChargingCalculator() {
  const [monthlyKm, setMonthlyKm] = useState(1500);
  const [selectedModel, setSelectedModel] = useState(0);
  const [customEfficiency, setCustomEfficiency] = useState(16);
  const [isCustomEfficiency, setIsCustomEfficiency] = useState(false);
  const [selectedRate, setSelectedRate] = useState(0);
  const [customRate, setCustomRate] = useState(0.65);
  const [isCustomRate, setIsCustomRate] = useState(false);
  const [gasolinePrice, setGasolinePrice] = useState(7.5);
  const [copied, setCopied] = useState(false);

  const efficiency = isCustomEfficiency
    ? customEfficiency
    : evModels[selectedModel].efficiency;

  const electricityRate = isCustomRate
    ? customRate
    : rateOptions[selectedRate].value;

  const results = useMemo(() => {
    const monthlyKwh = (monthlyKm * efficiency) / 100;
    const monthlyCost = monthlyKwh * electricityRate;
    const annualCost = monthlyCost * 12;
    const monthlyGasolineLiters = (monthlyKm * GASOLINE_CONSUMPTION) / 100;
    const monthlyGasolineCost = monthlyGasolineLiters * gasolinePrice;
    const annualGasolineCost = monthlyGasolineCost * 12;
    const monthlySavings = monthlyGasolineCost - monthlyCost;
    const annualSavings = annualGasolineCost - annualCost;
    const costPerKm = monthlyCost / (monthlyKm || 1);

    return {
      monthlyKwh,
      monthlyCost,
      annualCost,
      monthlyGasolineCost,
      annualGasolineCost,
      monthlySavings,
      annualSavings,
      costPerKm,
    };
  }, [monthlyKm, efficiency, electricityRate, gasolinePrice]);

  const formatNumber = (n: number, decimals = 0) =>
    n.toLocaleString('he-IL', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const formatCurrency = (n: number) => `${formatNumber(n)}`;

  const handleShare = async () => {
    const carName = isCustomEfficiency
      ? `צריכה ${customEfficiency} קוט"ש/100 ק"מ`
      : evModels[selectedModel].name;

    const text = [
      `מחשבון עלות טעינה - ${carName}`,
      `נסיעה חודשית: ${formatNumber(monthlyKm)} ק"מ`,
      `צריכת חשמל חודשית: ${formatNumber(results.monthlyKwh, 1)} קוט"ש`,
      `עלות טעינה חודשית: ${formatCurrency(results.monthlyCost)} ש"ח`,
      `עלות טעינה שנתית: ${formatCurrency(results.annualCost)} ש"ח`,
      `חיסכון חודשי לעומת דלק: ${formatCurrency(results.monthlySavings)} ש"ח`,
      `חיסכון שנתי לעומת דלק: ${formatCurrency(results.annualSavings)} ש"ח`,
      '',
      'חושב על EV Shop - ev-shop.co.il/tools/charging-calculator',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="space-y-6">
        {/* Monthly Distance */}
        <div className="bg-white rounded-xl border border-border/50 p-6">
          <label className="block font-semibold mb-3">
            נסיעה חודשית (ק&quot;מ)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={100}
              max={5000}
              step={50}
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(Number(e.target.value))}
              className="flex-1 accent-blue-600"
            />
            <input
              type="number"
              min={0}
              max={10000}
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(Number(e.target.value) || 0)}
              className="w-24 border border-border rounded-lg px-3 py-2 text-center text-sm font-medium"
            />
          </div>
          <p className="text-xs text-muted mt-2">
            ממוצע ישראלי: כ-1,200-1,800 ק&quot;מ בחודש
          </p>
        </div>

        {/* Car Model / Efficiency */}
        <div className="bg-white rounded-xl border border-border/50 p-6">
          <label className="block font-semibold mb-3">
            דגם רכב / צריכת אנרגיה (קוט&quot;ש/100 ק&quot;מ)
          </label>
          <div className="space-y-3">
            <select
              value={isCustomEfficiency ? 'custom' : selectedModel}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsCustomEfficiency(true);
                } else {
                  setIsCustomEfficiency(false);
                  setSelectedModel(Number(e.target.value));
                }
              }}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-white"
            >
              {evModels.map((model, i) => (
                <option key={model.name} value={i}>
                  {model.name} — {model.efficiency} קוט&quot;ש/100 ק&quot;מ
                </option>
              ))}
              <option value="custom">הזנה ידנית</option>
            </select>
            {isCustomEfficiency && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={8}
                  max={30}
                  step={0.5}
                  value={customEfficiency}
                  onChange={(e) =>
                    setCustomEfficiency(Number(e.target.value) || 16)
                  }
                  className="w-28 border border-border rounded-lg px-3 py-2 text-center text-sm"
                />
                <span className="text-sm text-muted">
                  קוט&quot;ש/100 ק&quot;מ
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Electricity Rate */}
        <div className="bg-white rounded-xl border border-border/50 p-6">
          <label className="block font-semibold mb-3">
            תעריף חשמל (&#8362;/קוט&quot;ש)
          </label>
          <div className="space-y-2">
            {rateOptions.map((option, i) => (
              <label
                key={option.label}
                className={`flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 text-sm transition-colors ${
                  !isCustomRate && selectedRate === i
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-border/50 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="rate"
                  checked={!isCustomRate && selectedRate === i}
                  onChange={() => {
                    setIsCustomRate(false);
                    setSelectedRate(i);
                  }}
                  className="accent-blue-600"
                />
                <span className="flex-1">{option.label}</span>
                <span className="font-medium">
                  {option.value.toFixed(2)} &#8362;
                </span>
              </label>
            ))}
            <label
              className={`flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 text-sm transition-colors ${
                isCustomRate
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-border/50 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="rate"
                checked={isCustomRate}
                onChange={() => setIsCustomRate(true)}
                className="accent-blue-600"
              />
              <span className="flex-1">תעריף מותאם אישית</span>
              {isCustomRate && (
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.01}
                  value={customRate}
                  onChange={(e) =>
                    setCustomRate(Number(e.target.value) || 0.65)
                  }
                  className="w-24 border border-border rounded-lg px-2 py-1 text-center text-sm"
                />
              )}
            </label>
          </div>
        </div>

        {/* Gasoline Price */}
        <div className="bg-white rounded-xl border border-border/50 p-6">
          <label className="block font-semibold mb-3">
            מחיר דלק להשוואה (&#8362;/ליטר)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={5}
              max={12}
              step={0.1}
              value={gasolinePrice}
              onChange={(e) => setGasolinePrice(Number(e.target.value))}
              className="flex-1 accent-blue-600"
            />
            <input
              type="number"
              min={0}
              max={20}
              step={0.1}
              value={gasolinePrice}
              onChange={(e) =>
                setGasolinePrice(Number(e.target.value) || 7.5)
              }
              className="w-24 border border-border rounded-lg px-3 py-2 text-center text-sm font-medium"
            />
          </div>
          <p className="text-xs text-muted mt-2">
            חישוב ההשוואה מבוסס על צריכת דלק ממוצעת של {GASOLINE_CONSUMPTION}{' '}
            ליטר/100 ק&quot;מ
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* EV Costs Card */}
        <div className="bg-white rounded-xl border border-border/50 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            עלות טעינה חשמלית
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted mb-1">צריכה חודשית</p>
              <p className="text-xl font-bold">
                {formatNumber(results.monthlyKwh, 1)}
              </p>
              <p className="text-xs text-muted">קוט&quot;ש</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted mb-1">עלות לק&quot;מ</p>
              <p className="text-xl font-bold">
                {results.costPerKm.toFixed(2)}
              </p>
              <p className="text-xs text-muted">&#8362;</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted mb-1">עלות חודשית</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(results.monthlyCost)}
              </p>
              <p className="text-xs text-muted">&#8362;</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted mb-1">עלות שנתית</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(results.annualCost)}
              </p>
              <p className="text-xs text-muted">&#8362;</p>
            </div>
          </div>
        </div>

        {/* Gasoline Comparison Card */}
        <div className="bg-white rounded-xl border border-border/50 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
              />
            </svg>
            השוואה לדלק
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted mb-1">עלות דלק חודשית</p>
              <p className="text-2xl font-bold text-orange-700">
                {formatCurrency(results.monthlyGasolineCost)}
              </p>
              <p className="text-xs text-muted">&#8362;</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted mb-1">עלות דלק שנתית</p>
              <p className="text-2xl font-bold text-orange-700">
                {formatCurrency(results.annualGasolineCost)}
              </p>
              <p className="text-xs text-muted">&#8362;</p>
            </div>
          </div>
        </div>

        {/* Savings Card */}
        <div className="bg-gradient-to-bl from-green-50 to-emerald-50 rounded-xl border border-green-200/50 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-800">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            החיסכון שלכם
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 rounded-lg p-4 text-center">
              <p className="text-xs text-muted mb-1">חיסכון חודשי</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(results.monthlySavings)}
              </p>
              <p className="text-xs text-muted">&#8362;</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4 text-center">
              <p className="text-xs text-muted mb-1">חיסכון שנתי</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(results.annualSavings)}
              </p>
              <p className="text-xs text-muted">&#8362;</p>
            </div>
          </div>
          <p className="text-sm text-green-700 mt-4 text-center font-medium">
            רכב חשמלי חוסך לכם כ-
            {results.monthlyGasolineCost > 0
              ? Math.round(
                  (results.monthlySavings / results.monthlyGasolineCost) * 100
                )
              : 0}
            % בעלויות דלק
          </p>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-white rounded-xl border border-border/50 px-5 py-3 text-sm font-medium hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <svg
            className="h-4 w-4 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          {copied ? 'הועתק ללוח!' : 'העתק תוצאות'}
        </button>
      </div>
    </div>
  );
}
