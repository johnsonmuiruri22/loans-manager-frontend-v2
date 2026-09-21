import {CustomerSummary} from '../CustomerUtils/Utils/customer-summary';

export interface LoanRequests{
  loanId: number;
  customerInformation: CustomerSummary;
  loanAmountRequested: number;
  loanAmountIssued: number;
  loanDuration: number;
  loanInterestRate: number;
  totalAmountToRepay: number;
  loanPurpose: string;
  loanStatus: string;
}
