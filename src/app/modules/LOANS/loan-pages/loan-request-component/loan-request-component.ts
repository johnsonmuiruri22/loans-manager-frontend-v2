import {Component, Inject} from '@angular/core';
import {MATERIALModule} from '../../../material/material-module';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CustomerRespDTO} from '../../../../appUtils/CustomerUtils/Utils/customer-resp-dto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomerService} from '../../../../SERVICES/CustomerService/customer-service';
import {LoanRequestDTO} from '../../../../appUtils/LoanUtils/loan-request-dto';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loan-request-component',
  imports: [MATERIALModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './loan-request-component.html',
  styleUrl: './loan-request-component.css',
})
export class LoanRequestComponent {

  loanForm!: FormGroup;
  isLoading: boolean = false;

  constructor(private dialogRef: MatDialogRef<LoanRequestComponent>,
              @Inject(MAT_DIALOG_DATA) public customer: CustomerRespDTO,
              private snackbar: MatSnackBar, private customerService: CustomerService,
              private fb: FormBuilder, private router: Router) {
    this.loanForm = this.fb.group({
      customerId: [this.customer.customerId,Validators.required],
      loanAmount: ['',
        [Validators.required,
        Validators.min(1000),
        Validators.max(100000),
        Validators.pattern('^[0-9]*$')]],
      loanPurpose: ['', Validators.required],
    });
  }

  onSubmit(): void{
    if (this.loanForm.invalid){
      this.snackbar.open('Please fill all the fields',
        'Close', {duration: 3000});
      this.loanForm.markAllAsTouched();
      return;
    }

    const requestData = this.loanForm.value as LoanRequestDTO;

    this.isLoading = true;

    this.customerService.requestLoan(requestData).subscribe({
      next: (response)=>{
        this.isLoading = false;
        this.snackbar.open(response.message, 'Close', {duration: 3000});
        this.dialogRef.close(true);
      },
      error: (error: any)=>{
        this.isLoading = false;
        this.snackbar.open("Loan request failed. Please try again later.",
          'Close', {duration: 3000});
        this.dialogRef.close();
      }
    });
  }

  onCancel(){
    this.dialogRef.close();
  }
}
