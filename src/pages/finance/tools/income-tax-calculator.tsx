import IncomeTaxCalculator from '../../../components/IncomeTaxCalculator/IncomeTaxCalculator';
import FinanceToolHostPage from '../../../components/FinanceGuide/FinanceToolHostPage';

export default function IncomeTaxToolOnlyPage() {
  return (
    <FinanceToolHostPage
      title="Income Tax Calculator Tool"
      description="Direct tool-only income tax calculator page for quick tax estimation and regime comparison."
      canonicalPath="/finance/tools/income-tax-calculator"
    >
      <IncomeTaxCalculator />
    </FinanceToolHostPage>
  );
}
