export interface PaymentRecordDTO{
  repaymentId: number;
  loanId: number;
  customerFullName: string;
  amountPaid: number;
  totalAmountToBeRepaid: number;
  remainingBalance: number;
  repaidAt: Date;
  repaymentStatus: string;
  message: string;
}
