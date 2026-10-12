export interface CustomerDashboardSummaryDTO {
  // Customer Information
  customerFullName: string;
  phoneNumber: string;
  email: string;
  creditStatus: string;
  monthlyIncome: number;
  loanCount: number;
  address: string;

  // Loan Information
  loanAmountRequested: number;
  loanAmountIssued: number;
  loanDuration: number;
  interestRate: number;
  interestAmount: number;
  totalAmountToBeRepaid: number;

  // Repayment Information
  currentAmountPaid: number;
  remainingBalance: number;
  repaymentStatus: RepaymentStatus;
}

export type RepaymentStatus = | 'IN_PROGRESS' | 'PAID_OFF' | 'DEFAULTED';
