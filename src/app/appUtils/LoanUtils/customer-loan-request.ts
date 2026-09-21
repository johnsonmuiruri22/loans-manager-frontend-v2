export interface CustomerLoanRequest{
  message: string;
  customerFullName: string;
  customerCreditStatus: string;
  customerEmail: string;
  loanAmount: number;
  loanPurpose: string;
  requestedAt: Date;
}
