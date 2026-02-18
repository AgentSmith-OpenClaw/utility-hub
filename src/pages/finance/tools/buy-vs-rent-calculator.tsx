import BuyVsRentRedesigned from '../../../components/BuyVsRent/BuyVsRentRedesigned';
import FinanceToolHostPage from '../../../components/FinanceGuide/FinanceToolHostPage';

export default function BuyVsRentToolOnlyPage() {
  return (
    <FinanceToolHostPage
      title="Buy vs Rent Calculator Tool"
      description="Direct tool-only buy vs rent calculator page for housing decision analysis and long-term cost comparison."
      canonicalPath="/finance/tools/buy-vs-rent-calculator"
    >
      <BuyVsRentRedesigned />
    </FinanceToolHostPage>
  );
}
