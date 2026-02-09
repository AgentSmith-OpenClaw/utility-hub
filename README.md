# EMI Calculator

A professional, advanced EMI (Equated Monthly Installment) calculator with multiple prepayment support, interactive charts, and comprehensive amortization schedules.

## ✨ Features

### Core Functionality
- **Accurate EMI Calculation**: Calculate monthly installments based on loan amount, interest rate, and tenure
- **Multiple Prepayments**: Add unlimited one-time prepayments at different months
- **Interest Savings**: Automatically calculates how much interest you save with prepayments
- **Tenure Reduction**: Shows how many months earlier you can close the loan

### Visual Analytics
- **Interactive Charts**: 
  - Doughnut chart showing principal vs interest breakdown
  - Line chart displaying outstanding balance over time
  - Stacked area chart for principal vs interest payment trends
- **Real-time Updates**: All charts update instantly when you recalculate

### Advanced Features
- **Detailed Amortization Schedule**: Month-by-month breakdown of payments
- **Excel Export**: Download complete schedule as .xlsx file
- **Prepayment Tracking**: Visual indicators in schedule showing prepayment months
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Professional UI**: Modern gradient design with Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

### Testing

```bash
# Run all tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/emi-calculator.spec.ts
```

## 📁 Project Structure

```
src/
├── components/
│   └── EMICalculator/
│       ├── EMICalculator.tsx          # Main calculator component with UI
│       ├── EMICalculator.types.ts     # TypeScript interfaces
│       └── EMICalculator.utils.ts     # Calculation logic
├── hooks/
│   └── useEMI.ts                      # Custom React hook for EMI calculations
├── utils/
│   ├── excel.ts                       # Excel export functionality
│   └── validation.ts                  # Input validation
├── App.tsx                            # Main app component
├── index.tsx                          # Entry point
└── index.css                          # Tailwind CSS imports
tests/
└── emi-calculator.spec.ts             # Playwright E2E tests
```

## 🎯 How to Use

1. **Enter Loan Details**:
   - Loan Amount (₹)
   - Annual Interest Rate (%)
   - Loan Tenure (Years)

2. **Add Prepayments (Optional)**:
   - Specify the month number
   - Enter prepayment amount
   - Add optional description
   - Click "+ Add" to add multiple prepayments

3. **Calculate**: Click "Calculate EMI" to see results

4. **View Results**:
   - Monthly EMI amount
   - Total interest payable
   - Total amount to be paid
   - Interest saved with prepayments
   - Months saved

5. **Analyze**: View interactive charts showing:
   - Loan breakdown (principal vs interest)
   - Outstanding balance over time
   - Payment breakdown trends

6. **Export**: Download complete amortization schedule as Excel file

## 💡 Use Cases

- **Home Loans**: Calculate EMI for home/property loans
- **Car Loans**: Plan your vehicle financing
- **Personal Loans**: Understand your monthly commitments
- **Loan Planning**: Compare different prepayment strategies
- **Financial Planning**: Visualize loan payoff trajectory

## 🛠 Technologies Used

- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Interactive, responsive charts
- **React-Chartjs-2**: React wrapper for Chart.js
- **XLSX**: Excel file generation
- **File-saver**: Client-side file downloads
- **Playwright**: End-to-end testing

## 🧪 Testing

The app includes comprehensive Playwright tests covering:
- Page loading and UI elements
- EMI calculations
- Adding/removing prepayments
- Validation errors
- Chart rendering
- Prepayment benefits calculation
- Amortization schedule display

## 📊 Calculation Formula

**EMI Formula:**
```
EMI = [P x R x (1+R)^N] / [(1+R)^N-1]

Where:
P = Loan amount (principal)
R = Monthly interest rate (annual rate / 12 / 100)
N = Number of monthly installments (tenure in years × 12)
```

## 🚀 Deployment

This app can be easily deployed to:

### Vercel
```bash
npm run build
# Deploy the build folder
```

### Netlify
```bash
npm run build
# Deploy the build folder
```

### GitHub Pages
```bash
npm run build
# Deploy the build folder to gh-pages branch
```

## 🎨 Screenshots

The calculator features:
- Clean, modern interface
- Gradient color schemes
- Interactive form inputs
- Multiple chart visualizations
- Responsive table layouts
- Mobile-friendly design

## 📝 Future Enhancements

- [ ] Add comparison mode (compare multiple loan scenarios)
- [ ] Save calculations to local storage
- [ ] PDF export functionality
- [ ] Email share feature
- [ ] Print-friendly view
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Currency selection
- [ ] Loan comparison table

## 📄 License

MIT License - Feel free to use this calculator for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⚠️ Disclaimer

This calculator is for informational purposes only. Always consult with a financial advisor for actual loan decisions. Interest calculations may vary based on bank-specific terms and conditions.
