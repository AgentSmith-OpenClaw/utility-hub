import FIRECalculator from '../../../components/FIRECalculator/FIRECalculator';
import FinanceToolHostPage from '../../../components/FinanceGuide/FinanceToolHostPage';

export default function FIREToolOnlyPage() {
  return (
    <FinanceToolHostPage
      title="FIRE Calculator Tool"
      description="Direct tool-only FIRE calculator page for financial independence and early retirement corpus planning."
      canonicalPath="/finance/tools/fire-calculator"
    >
      <FIRECalculator />
    </FinanceToolHostPage>
  );
}
