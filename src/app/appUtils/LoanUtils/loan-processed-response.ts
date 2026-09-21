export interface LoanProcessedResponse{
  message: string;
  amountIssued: number;
  interestRateIssued: number;
  totalAmountToRepay: number;
  loanTermInMonths: number;
}
