import SIPWealthPlanner from '../../../components/SIPWealthPlanner/SIPWealthPlanner';
import FinanceToolHostPage from '../../../components/FinanceGuide/FinanceToolHostPage';

export default function SIPToolOnlyPage() {
  return (
    <FinanceToolHostPage
      title="SIP Calculator Tool"
      description="Direct tool-only SIP calculator page for future value, step-up SIP, and wealth projection analysis."
      canonicalPath="/finance/tools/sip-calculator"
    >
      <SIPWealthPlanner />
    </FinanceToolHostPage>
  );
}
