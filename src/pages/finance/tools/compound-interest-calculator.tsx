import CompoundInterestCalculator from '../../../components/CompoundInterestCalculator/CompoundInterestCalculator';
import FinanceToolHostPage from '../../../components/FinanceGuide/FinanceToolHostPage';

export default function CompoundInterestToolOnlyPage() {
  return (
    <FinanceToolHostPage
      title="Compound Interest Calculator Tool"
      description="Direct tool-only compound interest calculator page to model future value and contribution growth over time."
      canonicalPath="/finance/tools/compound-interest-calculator"
    >
      <CompoundInterestCalculator />
    </FinanceToolHostPage>
  );
}
