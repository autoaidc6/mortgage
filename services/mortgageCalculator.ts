
import { MortgageInputs, MortgageResults, AmortizationPoint } from '../types';

export const calculateMortgage = (inputs: MortgageInputs): MortgageResults => {
  const { balance, interestRate, loanTerm, oneTimePayment } = inputs;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTerm * 12;

  // Monthly Payment Formula: P * [r(1+r)^n] / [(1+r)^n - 1]
  const standardMonthlyPayment = balance * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const amortization: AmortizationPoint[] = [];
  let currentBalanceStd = balance;
  let currentBalanceAcc = balance;
  let totalInterestStd = 0;
  let totalInterestAcc = 0;
  let monthsSaved = 0;
  let accFinished = false;

  for (let m = 1; m <= totalMonths; m++) {
    // Standard Scenario
    const interestStd = currentBalanceStd * monthlyRate;
    const principalStd = Math.min(standardMonthlyPayment - interestStd, currentBalanceStd);
    totalInterestStd += interestStd;
    currentBalanceStd -= principalStd;

    // Accelerated Scenario
    let interestAcc = 0;
    if (!accFinished) {
      interestAcc = currentBalanceAcc * monthlyRate;
      
      // Apply the one-time payment ONLY in the first month
      const extraThisMonth = m === 1 ? oneTimePayment : 0;
      
      const totalAvailableForPrincipal = (standardMonthlyPayment - interestAcc) + extraThisMonth;
      const principalAcc = Math.min(totalAvailableForPrincipal, currentBalanceAcc);
      totalInterestAcc += interestAcc;
      currentBalanceAcc -= principalAcc;
      
      if (currentBalanceAcc <= 0) {
        accFinished = true;
        monthsSaved = totalMonths - m;
      }
    }

    // Capture data points for chart
    if (m === 1 || m % 12 === 0 || m === totalMonths) {
      amortization.push({
        month: m,
        year: Math.ceil(m / 12),
        standardBalance: Math.max(0, currentBalanceStd),
        acceleratedBalance: Math.max(0, currentBalanceAcc),
        standardInterestPaid: totalInterestStd,
        acceleratedInterestPaid: totalInterestAcc
      });
    }
  }

  return {
    amortization,
    totalInterestStandard: totalInterestStd,
    totalInterestAccelerated: totalInterestAcc,
    totalSavings: totalInterestStd - totalInterestAcc,
    monthsSaved,
    standardMonthlyPayment,
    yearsToPayoff: (totalMonths - monthsSaved) / 12
  };
};

export const formatCurrency = (value: number, currencyCode: string = 'USD', decimals: number = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const getCurrencySymbol = (currencyCode: string) => {
  return (0).toLocaleString('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace(/\d/g, '').trim();
};
