'use client';
import React, { useState, useMemo } from 'react';

interface FoodEntry {
  name: string;
  gi: number;
  carbsPer100g: number;
  category: string;
}

const FOOD_DATABASE: FoodEntry[] = [
  { name: 'Apple', gi: 36, carbsPer100g: 14, category: 'Fruits' },
  { name: 'Banana', gi: 51, carbsPer100g: 23, category: 'Fruits' },
  { name: 'Cantaloupe', gi: 65, carbsPer100g: 8, category: 'Fruits' },
  { name: 'Cherries', gi: 20, carbsPer100g: 12, category: 'Fruits' },
  { name: 'Watermelon', gi: 76, carbsPer100g: 8, category: 'Fruits' },
  { name: 'Broccoli', gi: 15, carbsPer100g: 7, category: 'Vegetables' },
  { name: 'Green Beans', gi: 15, carbsPer100g: 7, category: 'Vegetables' },
  { name: 'Spinach', gi: 15, carbsPer100g: 3, category: 'Vegetables' },
  { name: 'Sweet Potato', gi: 63, carbsPer100g: 20, category: 'Vegetables' },
  { name: 'Potato', gi: 78, carbsPer100g: 17, category: 'Vegetables' },
  { name: 'Chickpeas', gi: 28, carbsPer100g: 27, category: 'Legumes' },
  { name: 'Lentils', gi: 32, carbsPer100g: 20, category: 'Legumes' },
  { name: 'Fish', gi: 0, carbsPer100g: 0, category: 'Protein' },
  { name: 'Eggs', gi: 0, carbsPer100g: 1, category: 'Protein' },
  { name: 'Tofu', gi: 15, carbsPer100g: 2, category: 'Protein' },
  { name: 'Greek Yogurt', gi: 11, carbsPer100g: 4, category: 'Dairy' },
  { name: 'Milk', gi: 27, carbsPer100g: 5, category: 'Dairy' },
  { name: 'Peanuts', gi: 14, carbsPer100g: 16, category: 'Nuts' },
  { name: 'Quinoa', gi: 53, carbsPer100g: 21, category: 'Grains' },
  { name: 'Brown Rice', gi: 68, carbsPer100g: 23, category: 'Grains' },
  { name: 'White Rice', gi: 73, carbsPer100g: 28, category: 'Grains' },
  { name: 'Oatmeal', gi: 69, carbsPer100g: 12, category: 'Grains' },
  { name: 'Corn tortilla', gi: 46, carbsPer100g: 21, category: 'Grains' },
  { name: 'Whole wheat bread', gi: 69, carbsPer100g: 18, category: 'Grains' },
  { name: 'White bread', gi: 75, carbsPer100g: 20, category: 'Grains' },
  { name: 'Bagel', gi: 72, carbsPer100g: 24, category: 'Grains' },
  { name: 'Cornflakes', gi: 81, carbsPer100g: 26, category: 'Grains' },
  { name: 'Croissant', gi: 70, carbsPer100g: 23, category: 'Grains' },
  { name: 'Doughnut', gi: 76, carbsPer100g: 25, category: 'Grains' },
  { name: 'French baguette', gi: 95, carbsPer100g: 27, category: 'Grains' },
  { name: 'Glucose', gi: 100, carbsPer100g: 100, category: 'Reference' },
  { name: 'Honey', gi: 61, carbsPer100g: 82, category: 'Sweeteners' },
  { name: 'Popcorn', gi: 65, carbsPer100g: 18, category: 'Snacks' },
  { name: 'Orange', gi: 43, carbsPer100g: 12, category: 'Fruits' },
];

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Legumes', 'Protein', 'Dairy', 'Nuts', 'Grains', 'Sweeteners', 'Snacks', 'Reference'];

type GiClass = 'low' | 'medium' | 'high' | 'protein';

function getGiClass(gi: number): GiClass {
  if (gi === 0) return 'protein';
  if (gi < 55) return 'low';
  if (gi <= 70) return 'medium';
  return 'high';
}

function getGiColors(giClass: GiClass) {
  if (giClass === 'protein') return { badge: 'bg-slate-100 text-slate-600 border-slate-200', text: 'text-slate-600', label: 'Protein / No Carbs' };
  if (giClass === 'low') return { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'text-emerald-600', label: 'Low GI' };
  if (giClass === 'medium') return { badge: 'bg-amber-100 text-amber-700 border-amber-200', text: 'text-amber-600', label: 'Medium GI' };
  return { badge: 'bg-red-100 text-red-700 border-red-200', text: 'text-red-600', label: 'High GI' };
}

function getHealthTip(giClass: GiClass, foodName: string): string {
  if (giClass === 'protein') return `${foodName} contains negligible carbohydrates, so it has minimal impact on blood sugar. A great choice for blood sugar management.`;
  if (giClass === 'low') return `${foodName} is a low-GI food — it raises blood sugar slowly and steadily. This helps maintain stable energy levels and supports weight management and diabetes control.`;
  if (giClass === 'medium') return `${foodName} has a medium GI — it causes a moderate rise in blood sugar. Consider pairing it with protein, healthy fats, or fiber-rich foods to blunt the glycemic response.`;
  return `${foodName} is a high-GI food that causes a rapid spike in blood sugar. Enjoy sparingly, combine with protein or fiber, or choose a lower-GI alternative when possible.`;
}

export default function GlycemicIndexCalculator() {
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodEntry | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [customGi, setCustomGi] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const lowGiFoods = FOOD_DATABASE.filter((f) => {
    const c = getGiClass(f.gi);
    return c === 'low' || c === 'protein';
  });

  const bestByCategory = useMemo(() => {
    const grouped: Record<string, FoodEntry> = {};
    lowGiFoods.forEach((f) => {
      if (!grouped[f.category]) grouped[f.category] = f;
    });
    return grouped;
  }, [lowGiFoods]);

  const selectedCarbs = selectedFood ? (selectedFood.carbsPer100g * servingMultiplier * 100) / 100 : 0;
  const selectedGl = selectedFood && selectedFood.gi > 0 ? (selectedFood.gi * selectedCarbs) / 100 : 0;

  const customCarbsVal = parseFloat(customCarbs) || 0;
  const customGiVal = parseFloat(customGi) || 0;
  const customGl = customGiVal > 0 && customCarbsVal > 0 ? (customGiVal * customCarbsVal) / 100 : 0;
  const customGiClass = getGiClass(customGiVal);
  const customColors = getGiColors(customGiClass);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Search Food Database</h2>
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="text-xs font-medium text-violet-600 hover:text-violet-700 underline underline-offset-2"
          >
            {showCustom ? 'Browse foods' : 'Enter custom food'}
          </button>
        </div>

        {showCustom ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">GI Value (0–100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={customGi}
                  onChange={(e) => setCustomGi(e.target.value)}
                  placeholder="e.g. 55"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Carbs per serving (g)</label>
                <input
                  type="number"
                  min={0}
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value)}
                  placeholder="e.g. 20"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
              </div>
            </div>

            {customGiVal > 0 && (
              <div className={`rounded-xl border-2 p-4 ${customColors.badge} border-opacity-50`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-3xl font-extrabold ${customColors.text}`}>{customGiVal}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${customColors.badge}`}>{customColors.label}</span>
                </div>
                {customCarbsVal > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Carbs per serving</span>
                      <span className="font-semibold text-slate-800">{customCarbsVal}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Glycemic Load</span>
                      <span className="font-bold text-lg text-slate-900">{customGl.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {customGiVal > 0 && (
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
                <p className="text-xs text-violet-700 leading-relaxed">{getHealthTip(customGiClass, 'Custom food')}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search foods (e.g. apple, rice, broccoli...)"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 mb-3"
            />

            <div className="flex flex-wrap gap-1.5 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    selectedCategory === cat
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredFoods.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No foods found matching &quot;{search}&quot;</p>
              ) : (
                filteredFoods.map((food) => {
                  const giClass = getGiClass(food.gi);
                  const colors = getGiColors(giClass);
                  return (
                    <button
                      key={food.name}
                      onClick={() => setSelectedFood(food)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                        selectedFood?.name === food.name
                          ? 'border-violet-400 bg-violet-50 shadow-sm'
                          : 'border-slate-200 hover:border-violet-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="text-sm font-medium text-slate-800">{food.name}</span>
                        <span className="text-xs text-slate-400 ml-2">{food.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                          GI {food.gi}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {selectedFood && !showCustom && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedFood.name}</h3>
                <span className="text-xs text-slate-400">{selectedFood.category}</span>
              </div>
              {(() => {
                const giClass = getGiClass(selectedFood.gi);
                const colors = getGiColors(giClass);
                return (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>{colors.label}</span>
                );
              })()}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-600 mb-2">Serving Size</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0.25}
                  max={3}
                  step={0.25}
                  value={servingMultiplier}
                  onChange={(e) => setServingMultiplier(parseFloat(e.target.value))}
                  className="flex-1 accent-violet-600"
                />
                <span className="text-sm font-semibold text-slate-800 w-20 text-right">{servingMultiplier}×</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {servingMultiplier === 1 ? 'Standard serving (100g)' : `${(servingMultiplier * 100).toFixed(0)}g equivalent`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-xl border-2 p-4 text-center ${selectedFood.gi === 0 ? 'bg-slate-50 border-slate-200' : 'bg-violet-50 border-violet-200'}`}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Glycemic Index</p>
                <p className={`text-4xl font-extrabold ${selectedFood.gi === 0 ? 'text-slate-400' : 'text-violet-600'}`}>
                  {selectedFood.gi === 0 ? 'N/A' : selectedFood.gi}
                </p>
              </div>
              <div className="rounded-xl border-2 border-violet-200 bg-violet-50 p-4 text-center">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Glycemic Load</p>
                <p className="text-4xl font-extrabold text-violet-600">
                  {selectedFood.gi === 0 ? '—' : selectedGl.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Carbohydrates per serving</span>
                <span className="text-sm font-semibold text-slate-800">{selectedCarbs.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">GI Classification</span>
                <span className={`text-sm font-semibold ${getGiColors(getGiClass(selectedFood.gi)).text}`}>
                  {getGiColors(getGiClass(selectedFood.gi)).label}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-xs text-violet-700 leading-relaxed">
              {getHealthTip(getGiClass(selectedFood.gi), selectedFood.name)}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">About Glycemic Load</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              GL = (GI × carbs per serving) ÷ 100. A GL under 10 is considered low, 11–19 is medium, and 20+ is high. GL gives a more accurate picture of a food&apos;s real-world impact on blood sugar because it accounts for portion size.
            </p>
          </div>
        </div>
      )}

      {!showCustom && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-3">🏆 Best Low-GI Choices by Category</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(bestByCategory).slice(0, 8).map(([category, food]) => {
              const giClass = getGiClass(food.gi);
              const colors = getGiColors(giClass);
              return (
                <div key={category} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{food.name}</p>
                    <p className="text-xs text-slate-400">{category}</p>
                  </div>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${colors.badge}`}>GI {food.gi}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only and is not a substitute for medical advice. GI values are approximate and can vary based on ripeness, preparation, and individual response. Consult a qualified healthcare provider for personalized dietary guidance, especially if you have diabetes or other health conditions.
      </p>
    </div>
  );
}