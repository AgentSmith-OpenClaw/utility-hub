export const validateLoanInputs = (
  amount: number,
  rate: number,
  tenure: number
): { isValid: boolean; errors: string[] } => {
  const errors = [];
  if (amount <= 0) errors.push('Loan amount must be greater than 0');
  if (rate <= 0) errors.push('Interest rate must be greater than 0');
  if (tenure <= 0) errors.push('Tenure must be greater than 0');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
