import AmortizationCalculator from '../../../components/AmortizationCalculator/AmortizationCalculator';
import FinanceToolHostPage from '../../../components/FinanceGuide/FinanceToolHostPage';

export default function AmortizationToolOnlyPage() {
  return (
    <FinanceToolHostPage
      title="Amortization Calculator Tool"
      description="Direct tool-only amortization calculator page for full month-wise principal and interest schedule analysis."
      canonicalPath="/finance/tools/amortization-calculator"
    >
      <AmortizationCalculator />
    </FinanceToolHostPage>
  );
}
