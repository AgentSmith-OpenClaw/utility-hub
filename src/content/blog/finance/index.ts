import type { BlogArticle } from '../types';
import { toMetaList, toRecord } from '../types';

import { understandingCompoundInterest } from './understanding-compound-interest';
import { understandingEmiCalculations } from './understanding-emi-calculations';
import { prepaymentStrategiesGuide } from './prepayment-strategies-guide';
import { fireMovementExplained } from './fire-movement-explained';
import { coastFireStrategy } from './coast-fire-strategy';
import { stepUpSipVsFlatSip } from './step-up-sip-vs-flat-sip';
import { inflationProofInvestingGuide } from './inflation-proof-investing-guide';
import { buyVsRentDecisionFramework } from './buy-vs-rent-decision-framework';
import { mortgageBasicsFindingTheBestDeal } from './mortgage-basics-finding-the-best-deal';
import { amortizationExplainedWhyInterestHeavyEarly } from './amortization-explained-why-interest-heavy-early';
import { usTaxBracketsDeductionsTakeHomePay } from './us-tax-brackets-deductions-take-home-pay';
import { realEstateInvestmentVsStockMarket } from './real-estate-investment-vs-stock-market';
import { personalLoanVsAlternatives } from './personal-loan-vs-alternatives';
import { retirementSavingsAgeMilestones } from './retirement-savings-age-milestones';
import { rothVsTraditionalIra } from './roth-vs-traditional-ira';
import { emergencyFundEssentials } from './emergency-fund-essentials';
import { fourOhOneKEmployerMatchStrategy } from './401k-employer-match-strategy';
import { indexFundsVsMutualFundsVsEtfs } from './index-funds-vs-mutual-funds-vs-etfs';
import { dollarCostAveragingVsLumpSum } from './dollar-cost-averaging-vs-lump-sum';
import { taxLossHarvestingExplained } from './tax-loss-harvesting-explained';
import { creditScoreFundamentals } from './credit-score-fundamentals';
import { debtSnowballVsAvalanche } from './debt-snowball-vs-avalanche';
import { hsaTripleTaxAdvantage } from './hsa-triple-tax-advantage';
import { sequenceOfReturnsRisk } from './sequence-of-returns-risk';
import { bondBasicsFixedIncome } from './bond-basics-fixed-income';
import { backdoorRothStrategy } from './backdoor-roth-strategy';
import { assetAllocationByAge } from './asset-allocation-by-age';
import { dividendInvestingGuide } from './dividend-investing-guide';
import { megaBackdoorRoth } from './mega-backdoor-roth';
import { recessionInvestingStrategy } from './recession-investing-strategy';
import { estatePlanningBasics } from './estate-planning-basics';
import { socialSecurityOptimization } from './social-security-optimization';
import { highYieldSavingsVsMoneyMarket } from './high-yield-savings-vs-money-market';
import { budgetFrameworks503020 } from './budget-frameworks-50-30-20';
import { whenMortgageRefinanceIsWorthIt } from './when-mortgage-refinance-is-worth-it';
import { aprVsApyExplained } from './apr-vs-apy-explained';
import { capitalGainsTaxStrategies } from './capital-gains-tax-strategies';
import { cdLaddersVsTreasuryBills } from './cd-ladders-vs-treasury-bills';
import { creditCardSnowballVsAvalanche } from './credit-card-snowball-vs-avalanche';
import { hdhpVsPpoComparison } from './hdhp-vs-ppo-comparison';
import { sepIraVsSolo401k } from './sep-ira-vs-solo-401k';
import { rentalPropertyCapRateGuide } from './rental-property-cap-rate-guide';
import { autoLoanVsCashDecision } from './auto-loan-vs-cash-decision';
import { netWorthByAgeBenchmarks } from './net-worth-by-age-benchmarks';
import { vatGstSalesTaxExplained } from './vat-gst-sales-tax-explained';
import { studentLoanRefinanceDecision } from './student-loan-refinance-decision';
import { inflationProtectSavings } from './inflation-protect-savings';

export const articles: BlogArticle[] = [
  understandingCompoundInterest,
  understandingEmiCalculations,
  prepaymentStrategiesGuide,
  fireMovementExplained,
  coastFireStrategy,
  stepUpSipVsFlatSip,
  inflationProofInvestingGuide,
  buyVsRentDecisionFramework,
  mortgageBasicsFindingTheBestDeal,
  amortizationExplainedWhyInterestHeavyEarly,
  usTaxBracketsDeductionsTakeHomePay,
  realEstateInvestmentVsStockMarket,
  personalLoanVsAlternatives,
  retirementSavingsAgeMilestones,
  rothVsTraditionalIra,
  emergencyFundEssentials,
  fourOhOneKEmployerMatchStrategy,
  indexFundsVsMutualFundsVsEtfs,
  dollarCostAveragingVsLumpSum,
  taxLossHarvestingExplained,
  creditScoreFundamentals,
  debtSnowballVsAvalanche,
  hsaTripleTaxAdvantage,
  sequenceOfReturnsRisk,
  bondBasicsFixedIncome,
  backdoorRothStrategy,
  assetAllocationByAge,
  dividendInvestingGuide,
  megaBackdoorRoth,
  recessionInvestingStrategy,
  estatePlanningBasics,
  socialSecurityOptimization,
  highYieldSavingsVsMoneyMarket,
  budgetFrameworks503020,
  whenMortgageRefinanceIsWorthIt,
  aprVsApyExplained,
  capitalGainsTaxStrategies,
  cdLaddersVsTreasuryBills,
  creditCardSnowballVsAvalanche,
  hdhpVsPpoComparison,
  sepIraVsSolo401k,
  rentalPropertyCapRateGuide,
  autoLoanVsCashDecision,
  netWorthByAgeBenchmarks,
  vatGstSalesTaxExplained,
  studentLoanRefinanceDecision,
  inflationProtectSavings,
];

export const articleMap = toRecord(articles);
export const articleList = toMetaList(articles);
