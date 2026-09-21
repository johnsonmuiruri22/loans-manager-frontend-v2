export interface LoanProcessingInfo{
  loanId: number;
  loanAmountToIssue: number;
  durationInMonths: number;
  interestRate: number;
  totalAmountToRepay: number;
  loanPurpose: string;
  processedAt: string;
}
