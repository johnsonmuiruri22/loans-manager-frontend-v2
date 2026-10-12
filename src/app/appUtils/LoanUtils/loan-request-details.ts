import {CustomerSummary} from '../CustomerUtils/Utils/customer-summary';

export interface LoanRequestDetails {
  loanId: number;
  customerInformation: CustomerSummary;
  loanAmountRequested: number;
  loanAmountIssued: number;
  loanDuration: number;
  loanInterestRate: number;
  loanInterestAmount: number;
  totalAmountToRepay: number;
  loanPurpose: string;
  loanStatus: string;
}
