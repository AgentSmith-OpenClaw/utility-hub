# Health Tools Roadmap

**Goal:** Expand the `/health` section from 1 tool to a comprehensive, SEO-optimized health calculator suite targeting search-intent traffic in developed markets (US, UK, Canada, Australia, EU).

**Current tool count:** 1 (BMI Calculator)
**Target tool count:** 20–25 over the next 6–9 months

---

## Selection Criteria

Each proposed tool was evaluated on:
1. **Search volume** — Does the keyword get significant monthly searches in US/UK/CA/AU?
2. **Search intent** — Is the user looking for an interactive calculator (not just an article)?
3. **Uniqueness** — Can we rank against existing competitors with better UX + SEO content?
4. **Implementation feasibility** — Can it be built as a pure client-side calculator with no API dependency?
5. **Audience fit** — Is it relevant to health-conscious adults in developed countries?

---

## Tier 1 — Highest Priority (Launch First)

These target the highest-volume, most-competitive keywords where a polished tool with strong SEO content can capture traffic quickly.

### 1. Calorie Calculator
| | |
|---|---|
| **Slug** | `calorie-calculator` |
| **Icon** | 🔥 |
| **Tags** | `['Calories', 'Diet', 'Weight Loss']` |
| **Description** | Calculate your daily calorie needs based on age, weight, height, gender, and activity level. Supports goal-based planning for weight loss, maintenance, and muscle gain. |
| **Search volume** | Very High (450K–1M+ monthly US) |
| **Keyword targets** | "calorie calculator", "how many calories should I eat", "daily calorie intake calculator", "calories per day calculator" |
| **Algorithm** | Mifflin-St Jeor equation × activity multiplier, then ±500 for loss/gain goals |
| **Notes** | #1 most-searched health calculator. Must have meal-plan breakdown and macro split. |

### 2. TDEE Calculator (Total Daily Energy Expenditure)
| | |
|---|---|
| **Slug** | `tdee-calculator` |
| **Icon** | ⚡ |
| **Tags** | `['TDEE', 'Fitness', 'Metabolism']` |
| **Description** | Calculate your Total Daily Energy Expenditure to understand exactly how many calories you burn per day based on your basal metabolic rate and activity level. |
| **Search volume** | Very High (200K–500K monthly US) |
| **Keyword targets** | "tdee calculator", "total daily energy expenditure calculator", "how many calories do I burn" |
| **Algorithm** | BMR (Mifflin-St Jeor) × 5-level activity multiplier |
| **Notes** | Complements BMI + Calorie calculators. Cross-link aggressively. Shows breakdown of BMR vs. activity calories. |

### 3. Protein Calculator
| | |
|---|---|
| **Slug** | `protein-calculator` |
| **Icon** | 🥩 |
| **Tags** | `['Protein', 'Nutrition', 'Fitness']` |
| **Description** | Calculate your daily protein requirements based on body weight, activity level, and fitness goals. Includes recommendations per meal and food source comparisons. |
| **Search volume** | High (150K–350K monthly US) |
| **Keyword targets** | "protein calculator", "how much protein per day", "daily protein intake calculator", "protein intake calculator by weight" |
| **Algorithm** | Dynamic multiplier (0.8–2.2 g/kg) based on activity + goal |
| **Notes** | Huge in fitness/bodybuilding communities. Include per-meal breakdown and top protein food sources table. |

### 4. Macro Calculator (Macronutrient Calculator)
| | |
|---|---|
| **Slug** | `macro-calculator` |
| **Icon** | 🍽️ |
| **Tags** | `['Macros', 'Nutrition', 'Diet']` |
| **Description** | Calculate your optimal macronutrient split — protein, carbs, and fat — for your calorie target, body weight, and fitness goals. Supports keto, low-carb, and standard splits. |
| **Search volume** | High (150K–350K monthly US) |
| **Keyword targets** | "macro calculator", "macronutrient calculator", "macro calculator for weight loss", "flexible dieting calculator" |
| **Algorithm** | Calorie base from TDEE, then split by goal (e.g., 40/30/30, keto 25/5/70) |
| **Notes** | Essential companion to Calorie + TDEE. Offer preset diet profiles (keto, paleo, zone, standard). |

### 5. Calorie Deficit Calculator
| | |
|---|---|
| **Slug** | `calorie-deficit-calculator` |
| **Icon** | 📉 |
| **Tags** | `['Calorie Deficit', 'Weight Loss', 'Diet']` |
| **Description** | Calculate how long it will take to reach your goal weight based on your calorie deficit. See projected weekly and monthly weight loss with a timeline chart. |
| **Search volume** | High (150K–300K monthly US) |
| **Keyword targets** | "calorie deficit calculator", "how long to lose weight calculator", "weight loss timeline calculator" |
| **Algorithm** | 3500 kcal ≈ 1 lb fat; project weekly loss from deficit; warn on deficits >1000 kcal |
| **Notes** | High intent — users with this query are ready to act. Include a projected-weight-loss chart (Recharts). |

### 6. Body Fat Calculator
| | |
|---|---|
| **Slug** | `body-fat-calculator` |
| **Icon** | 📐 |
| **Tags** | `['Body Fat', 'Fitness', 'Body Composition']` |
| **Description** | Estimate your body fat percentage using the US Navy method or BMI-based formula. Get your fat mass, lean mass, and body fat category with a visual breakdown. |
| **Search volume** | High (150K–300K monthly US) |
| **Keyword targets** | "body fat calculator", "body fat percentage calculator", "navy body fat calculator" |
| **Algorithm** | US Navy method (neck, waist, height) + BMI-based fallback;Jackson-Polsk 3-site optional |
| **Notes** | Natural complement to BMI. Offer both metric and imperial. Include visual body-fat-level chart. |

### 7. Sleep Calculator
| | |
|---|---|
| **Slug** | `sleep-calculator` |
| **Icon** | 😴 |
| **Tags** | `['Sleep', 'Wellness', 'Circadian']` |
| **Description** | Find the best times to fall asleep or wake up based on 90-minute sleep cycles. Wake up refreshed by aligning with your natural circadian rhythm. |
| **Search volume** | High (200K–400K monthly US) |
| **Keyword targets** | "sleep calculator", "what time should I wake up", "sleep cycle calculator", "best time to sleep calculator" |
| **Algorithm** | 90-min cycles + 14-min fall-asleep offset; 4–6 cycle recommendations |
| **Notes** | Very shareable. Include both "I want to wake up at…" and "I'm going to bed now…" modes. Trending in wellness circles. |

---

## Tier 2 — High Priority (Launch in Wave 2)

Strong search volume with lower competition — great for building topical authority.

### 8. Water Intake Calculator
| | |
|---|---|
| **Slug** | `water-intake-calculator` |
| **Icon** | 💧 |
| **Tags** | `['Hydration', 'Wellness', 'Water']` |
| **Description** | Calculate how much water you should drink daily based on your weight, activity level, climate, and health conditions. |
| **Search volume** | Medium-High (80K–200K monthly US) |
| **Keyword targets** | "water intake calculator", "how much water should I drink", "daily water intake calculator" |
| **Algorithm** | Weight-based formula (30–35 mL/kg) adjusted for exercise, heat, altitude |

### 9. Ideal Weight Calculator
| | |
|---|---|
| **Slug** | `ideal-weight-calculator` |
| **Icon** | 🎯 |
| **Tags** | `['Ideal Weight', 'Health', 'BMI']` |
| **Description** | Find your ideal body weight using multiple formulas — Devine, Robinson, Miller, and Hamwi. Compare results across all four methods. |
| **Search volume** | Medium-High (80K–150K monthly US) |
| **Keyword targets** | "ideal weight calculator", "ideal body weight calculator", "healthy weight for my height" |
| **Algorithm** | Devine, Robinson, Miller, Hamwi formulas with side-by-side comparison |

### 10. Waist-to-Hip Ratio Calculator
| | |
|---|---|
| **Slug** | `waist-to-hip-ratio-calculator` |
| **Icon** | 📏 |
| **Tags** | `['WHR', 'Body Shape', 'Health Risk']` |
| **Description** | Calculate your waist-to-hip ratio and assess your risk for cardiovascular disease and type 2 diabetes. Includes WHO classification. |
| **Search volume** | Medium (50K–120K monthly US) |
| **Keyword targets** | "waist to hip ratio calculator", "whr calculator", "waist hip ratio chart" |
| **Algorithm** | Waist ÷ Hip; WHO risk thresholds by gender |

### 11. Target Heart Rate Calculator
| | |
|---|---|
| **Slug** | `heart-rate-calculator` |
| **Icon** | ❤️ |
| **Tags** | `['Heart Rate', 'Fitness', 'Cardio']` |
| **Description** | Calculate your target heart rate zones for different exercise intensities — fat burn, cardio, peak — using the Karvonen formula. |
| **Search volume** | Medium-High (80K–150K monthly US) |
| **Keyword targets** | "target heart rate calculator", "heart rate zone calculator", "karvonen formula calculator", "max heart rate calculator" |
| **Algorithm** | Karvonen formula: THR = ((HRmax − HRrest) × %Intensity) + HRrest; also Tanaka for HRmax |

### 12. Blood Pressure Calculator
| | |
|---|---|
| **Slug** | `blood-pressure-calculator` |
| **Icon** | 🩺 |
| **Tags** | `['Blood Pressure', 'Cardiovascular', 'Health']` |
| **Description** | Classify your blood pressure reading using AHA/ACC guidelines. Understand what your systolic and diastolic numbers mean for your heart health. |
| **Search volume** | Medium-High (100K–200K monthly US) |
| **Keyword targets** | "blood pressure calculator", "bp chart", "is my blood pressure normal", "blood pressure categories" |
| **Algorithm** | AHA/ACC 2017 classification matrix (Normal → Crisis) |

### 13. Pregnancy Due Date Calculator
| | |
|---|---|
| **Slug** | `due-date-calculator` |
| **Icon** | 🤰 |
| **Tags** | `['Pregnancy', 'Due Date', 'Women's Health']` |
| **Description** | Calculate your estimated due date and current gestational week based on your last menstrual period or conception date. Includes a week-by-week pregnancy timeline. |
| **Search volume** | Very High (500K–1M+ monthly US) |
| **Keyword targets** | "due date calculator", "pregnancy due date calculator", "when am I due" |
| **Algorithm** | Naegele's rule (LMP + 280 days); optional conception-date mode |
| **Notes** | Very high volume but competitive. Worth it for the traffic alone. Consider cross-linking to ovulation calculator. |

### 14. Ovulation Calculator
| | |
|---|---|
| **Slug** | `ovulation-calculator` |
| **Icon** | 🌸 |
| **Tags** | `['Ovulation', 'Fertility', 'Women's Health']` |
| **Description** | Predict your fertile window and ovulation date based on your menstrual cycle length. See your chances of conception each day. |
| **Search volume** | Very High (300K–700K monthly US) |
| **Keyword targets** | "ovulation calculator", "fertile window calculator", "when do I ovulate" |
| **Algorithm** | Cycle length – 14 for ovulation day; 5-day fertile window; 2-cycle projection |
| **Notes** | Very high search volume. Cross-link with period calculator and due date calculator. |

### 15. Keto Calculator
| | |
|---|---|
| **Slug** | `keto-calculator` |
| **Icon** | 🥑 |
| **Tags** | `['Keto', 'Low Carb', 'Diet']` |
| **Description** | Calculate your optimal keto macros — net carbs, protein, and fat — to achieve and maintain ketosis. Includes electrolyte recommendations. |
| **Search volume** | High (150K–300K monthly US) |
| **Keyword targets** | "keto calculator", "keto macro calculator", "keto carb calculator", "how many carbs on keto" |
| **Algorithm** | TDEE-based; net carbs < 20–50g; protein 1.2–2.2g/kg; fat fills remaining |

---

## Tier 3 — Medium Priority (Launch in Wave 3)

Lower volume but build topical depth and long-tail coverage.

### 16. BMR Calculator (Basal Metabolic Rate)
| | |
|---|---|
| **Slug** | `bmr-calculator` |
| **Icon** | 🔥 |
| **Tags** | `['BMR', 'Metabolism', 'Fitness']` |
| **Description** | Calculate your Basal Metabolic Rate using the Mifflin-St Jeor equation. Understand how many calories you burn at rest. |
| **Search volume** | High (200K–400K monthly US) |
| **Notes** | Our BMI calculator already shows BMR, but a standalone page captures separate search traffic. Different keyword funnel. |

### 17. Carb Calculator
| | |
|---|---|
| **Slug** | `carb-calculator` |
| **Icon** | 🍞 |
| **Tags** | `['Carbs', 'Nutrition', 'Diet']` |
| **Description** | Calculate your daily carbohydrate intake based on calorie needs and dietary preference — standard, low-carb, or ketogenic. |
| **Search volume** | Medium (50K–120K monthly US) |

### 18. Period Calculator
| | |
|---|---|
| **Slug** | `period-calculator` |
| **Icon** | 🗓️ |
| **Tags** | `['Period', 'Menstrual', 'Women's Health']` |
| **Description** | Track and predict your next period, fertile window, and PMS symptoms based on your cycle length and last period date. |
| **Search volume** | High (200K–500K monthly US) |
| **Notes** | Companion to ovulation calculator. Targets slightly different keywords. |

### 19. Glycemic Index Calculator
| | |
|---|---|
| **Slug** | `glycemic-index-calculator` |
| **Icon** | 🍬 |
| **Tags** | `['Glycemic Index', 'Diabetes', 'Blood Sugar']` |
| **Description** | Search and calculate the glycemic index and glycemic load of common foods. Essential for diabetes management and blood sugar control. |
| **Search volume** | Medium (40K–100K monthly US) |

### 20. Blood Alcohol Content (BAC) Calculator
| | |
|---|---|
| **Slug** | `bac-calculator` |
| **Icon** | 🍺 |
| **Tags** | `['BAC', 'Alcohol', 'Safety']` |
| **Description** | Estimate your blood alcohol content based on drinks consumed, body weight, gender, and time. Understand when you'll be legally sober. |
| **Search volume** | High (150K–300K monthly US) |
| **Algorithm** | Widmark formula with gender/body weight adjustments |

### 21. Cholesterol Ratio Calculator
| | |
|---|---|
| **Slug** | `cholesterol-calculator` |
| **Icon** | 🫀 |
| **Tags** | `['Cholesterol', 'Heart Health', 'Lipids']` |
| **Description** | Calculate your total cholesterol/HDL ratio, LDL/HDL ratio, and triglyceride ratio. Understand your cardiovascular risk levels. |
| **Search volume** | Medium (40K–90K monthly US) |

### 22. Vitamin D Calculator
| | |
|---|---|
| **Slug** | `vitamin-d-calculator` |
| **Icon** | ☀️ |
| **Tags** | `['Vitamin D', 'Nutrition', 'Supplements']` |
| **Description** | Estimate your daily Vitamin D needs based on skin type, latitude, sun exposure, and diet. Applies Endocrine Society guidelines. |
| **Search volume** | Medium (30K–80K monthly US) |

### 23. Pregnancy Weight Gain Calculator
| | |
|---|---|
| **Slug** | `pregnancy-weight-gain-calculator` |
| **Icon** | 📈 |
| **Tags** | `['Pregnancy', 'Weight Gain', 'Women's Health']` |
| **Description** | Find out how much weight you should gain during pregnancy based on your pre-pregnancy BMI and gestational week, using IOM guidelines. |
| **Search volume** | Medium (60K–120K monthly US) |

### 24. Caffeine Calculator
| | |
|---|---|
| **Slug** | `caffeine-calculator` |
| **Icon** | ☕ |
| **Tags** | `['Caffeine', 'Wellness', 'Energy']` |
| **Description** | Calculate your total caffeine intake from coffee, tea, energy drinks, and more. See when your caffeine levels will drop below half. |
| **Search volume** | Medium (50K–100K monthly US) |
| **Algorithm** | Caffeine half-life (5–6 hours) decay curve; FDA 400mg/day limit |

### 25. Anxiety Score Calculator (GAD-7)
| | |
|---|---|
| **Slug** | `anxiety-score-calculator` |
| **Icon** | 🧠 |
| **Tags** | `['Anxiety', 'Mental Health', 'Wellness']` |
| **Description** |Assess your anxiety level using the clinically validated GAD-7 questionnaire. Get your score with severity classification and guidance on next steps. |
| **Search volume** | Medium (40K–90K monthly US) |
| **Notes** | Mental health tools are trending strongly post-pandemic. Differentiates us from calculator-only competitors. |

---

## Proposed Build Order (Sprints)

### Sprint 1–2 (Weeks 1–3) — Core Weight & Nutrition
1. Calorie Calculator
2. TDEE Calculator
3. Macro Calculator
4. Calorie Deficit Calculator

### Sprint 3–4 (Weeks 4–6) — Body Composition & Fitness
5. Body Fat Calculator
6. Protein Calculator
7. Ideal Weight Calculator
8. Target Heart Rate Calculator

### Sprint 5–6 (Weeks 7–9) — Women's Health
9. Pregnancy Due Date Calculator
10. Ovulation Calculator
11. Period Calculator
12. Pregnancy Weight Gain Calculator

### Sprint 7–8 (Weeks 10–12) — Wellness & Prevention
13. Sleep Calculator
14. Water Intake Calculator
15. Blood Pressure Calculator
16. BMR Calculator (standalone)

### Sprint 9–10 (Weeks 13–15) — Diet & Lifestyle Niches
17. Keto Calculator
18. Carb Calculator
19. BAC Calculator
20. Caffeine Calculator

### Sprint 11–12 (Weeks 16–18) — Long-tail & Depth
21. Waist-to-Hip Ratio Calculator
22. Cholesterol Calculator
23. Glycemic Index Calculator
24. Vitamin D Calculator
25. Anxiety Score Calculator (GAD-7)

---

## SEO Strategy Notes

### Cross-linking
- Every health tool should link to 3–4 related tools in the `ToolSEOContent` `relatedTools` prop
- Example flows: BMI → Body Fat → Calorie → TDEE → Macro → Protein
- Women's health cluster: Period → Ovulation → Due Date → Pregnancy Weight Gain

### Unique Content Advantage
- Each tool should include **4–6 FAQs** targeting "people also ask" questions
- Write **2,000+ words** of unique procedural/explanatory content in the SEO section
- Include **step-by-step" how to use"** instructions in the `steps` prop
- Add **clinical disclaimers** — builds trust and differentiates from spammy competitors

### Keyword Targets Per Page
Each tool page should target:
- **Primary keyword** — the tool name itself (e.g., "calorie calculator")
- **Secondary keywords** — 3–5 variations (e.g., "daily calorie intake calculator", "how many calories should I eat")
- **Long-tail keywords** — question phrases (e.g., "how many calories should a 30 year old woman eat to lose weight")

### Internal Linking Pattern
```
BMI Calculator ←→ Body Fat Calculator ←→ Ideal Weight Calculator
       ↓                ↓
  Calorie Calculator ←→ TDEE Calculator ←→ BMR Calculator
       ↓                ↓                    ↓
  Calorie Deficit   Macro Calculator    Protein Calculator
       ↓                ↓
  Keto Calculator   Carb Calculator

Women's Health Cluster:
  Period Calculator ←→ Ovulation Calculator ←→ Due Date Calculator ←→ Pregnancy Weight Gain

Wellness Cluster:
  Sleep Calculator ←→ Caffeine Calculator
  Water Intake Calculator ←→ Vitamin D Calculator
  Blood Pressure Calculator ←→ Cholesterol Calculator ←→ Heart Rate Calculator
```

---

## Competitive Differentiation

| Differentiator | How We Win |
|---|---|
| **Client-side only** | No data sent to server — privacy-first messaging resonates with health-conscious users |
| **Mobile-first UX** | Most competitors have clunky layouts; our ToolShell is responsive by default |
| **Comprehensive results** | Don't just show a number — show category, comparison chart, actionable next steps |
| **SEO content depth** | 2,000+ words of unique content per page, FAQs, how-to steps |
| **Cross-linked hub** | Every tool links to 3–4 related tools (topical authority signal) |
| **Modern design** | Violet gradient hero, clean cards, Recharts visualizations |

---

## Metrics to Track

| Metric | Target |
|---|---|
| Organic impressions (Search Console) | 50K/week after 3 months |
| Click-through rate from search | >5% |
| Avg. time on page | >2 minutes |
| Tools built per week | 2–3 |
| Page indexed by Google | Within 48 hours of deploy |
| Core Web Vitals (LCP, FID, CLS) | All "Good" |

---

*Last updated: 2026-05-25*