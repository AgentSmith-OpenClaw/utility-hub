import EMICalculator from '../../../components/EMICalculator/EMICalculator';
import FinanceToolHostPage from '../../../components/FinanceGuide/FinanceToolHostPage';

export default function EMIToolOnlyPage() {
  return (
    <FinanceToolHostPage
      title="EMI Calculator Tool"
      description="Direct tool-only EMI calculator page for instant loan installment, amortization, and prepayment simulation."
      canonicalPath="/finance/tools/emi-calculator"
    >
      <EMICalculator />
    </FinanceToolHostPage>
  );
}
 