export interface LoanProcessedResponse{
  message: string;
  loanStatus: string;
  amountIssued: number;
  interestRateIssued: number;
  interestAmount: number;
  totalAmountToRepay: number;
  loanTermInMonths: number;
}
