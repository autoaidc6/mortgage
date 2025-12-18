
export interface MortgageInputs {
  balance: number;
  interestRate: number;
  loanTerm: number;
  oneTimePayment: number;
}

export interface AmortizationPoint {
  month: number;
  year: number;
  standardBalance: number;
  acceleratedBalance: number;
  standardInterestPaid: number;
  acceleratedInterestPaid: number;
}

export interface MortgageResults {
  amortization: AmortizationPoint[];
  totalInterestStandard: number;
  totalInterestAccelerated: number;
  totalSavings: number;
  monthsSaved: number;
  standardMonthlyPayment: number;
  yearsToPayoff: number;
}

export interface PeriodicSavings {
  day: number;
  week: number;
  month: number;
  year: number;
  total: number;
}
