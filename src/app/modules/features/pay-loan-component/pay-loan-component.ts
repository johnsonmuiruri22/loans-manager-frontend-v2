import {Component, Inject} from '@angular/core';
import {MATERIALModule} from '../../material/material-module';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoanService} from '../../../SERVICES/LoanService/loan-service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PaymentRecordDTO} from '../../../appUtils/LoanRepaymentUtils/payment-record-dto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RepaymentRequest} from '../../../appUtils/LoanRepaymentUtils/repayment-request';

@Component({
  selector: 'app-pay-loan-component',
  imports: [MATERIALModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pay-loan-component.html',
  styleUrl: './pay-loan-component.css',
})
export class PayLoanComponent {

  isLoading: boolean = false;
  paymentForm!: FormGroup;

  constructor(private fb: FormBuilder, private loanService: LoanService,
              private dialogRef: MatDialogRef<PayLoanComponent>,
              @Inject(MAT_DIALOG_DATA) public payment: PaymentRecordDTO,
              private snackbar: MatSnackBar) {
    this.paymentForm = this.fb.group({
      repaymentId: [this.payment.repaymentId, Validators.required],
      amountToPay: ['',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^[0-9]*$')
        ]]
    });
  }

  onSubmit(): void{
    if (this.paymentForm.invalid){
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.paymentForm.value as RepaymentRequest;

    this.loanService.payLoan(formValue).subscribe({
      next: (response)=>{
        this.isLoading = false;
        this.snackbar.open(response.message,
          'Close', {duration: 3000});
        this.dialogRef.close(true);
      },
      error: (error)=>{
        this.isLoading = false;
        this.snackbar.open(error.error.message,
          'Close', {duration: 3000});
      }
    });

  }

  onCancel(){
    this.dialogRef.close();
  }

}
