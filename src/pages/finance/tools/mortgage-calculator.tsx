import MortgageCalculator from '../../../components/MortgageCalculator/MortgageCalculator';
import FinanceToolHostPage from '../../../components/FinanceGuide/FinanceToolHostPage';

export default function MortgageToolOnlyPage() {
  return (
    <FinanceToolHostPage
      title="Mortgage Calculator Tool"
      description="Direct tool-only mortgage calculator page for monthly payment breakdown and loan affordability scenarios."
      canonicalPath="/finance/tools/mortgage-calculator"
    >
      <MortgageCalculator />
    </FinanceToolHostPage>
  );
}
