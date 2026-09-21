import {Component, Inject, signal} from '@angular/core';
import {MATERIALModule} from '../../../../modules/material/material-module';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomerService} from '../../../../SERVICES/CustomerService/customer-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CustomerRespDTO} from '../../Utils/customer-resp-dto';
import {CustomerReqDTO} from '../../Utils/customer-req-dto';

@Component({
  selector: 'app-update-customer-component',
  imports: [MATERIALModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-customer-component.html',
  styleUrl: './update-customer-component.css',
})
export class UpdateCustomerComponent {

  updateCustomerForm!: FormGroup;
  loading = signal(false);

  constructor(private customerService: CustomerService, private snackbar: MatSnackBar,
              private dialogRef: MatDialogRef<UpdateCustomerComponent>,
              @Inject(MAT_DIALOG_DATA) public customer: CustomerRespDTO,
              private fb: FormBuilder) {
    this.updateCustomerForm = this.fb.group({
      surname: [this.customer.surname,Validators.required],
      otherNames: [this.customer.otherNames,Validators.required],
      gender: [this.customer.gender,Validators.required],
      dob: [this.customer.dob,Validators.required],
      phone: [
        this.customer.phone,
        [
          Validators.required,
          Validators.pattern(/^\d{10}$/)
        ]
      ],
      email: [this.customer.email,[Validators.email,Validators.required]],
      residence: [this.customer.residence,Validators.required],
      occupation: [this.customer.occupation,Validators.required],
      monthlyIncome: [this.customer.monthlyIncome,[Validators.required, Validators.min(0)]],
    });
  }

  onUpdate(): void{
    if (this.updateCustomerForm.invalid) {
      this.updateCustomerForm.markAllAsTouched();
      this.snackbar.open(
        'Please correct the errors in the form',
        'Close',
        { duration: 3000 }
      );
      return;
    }


    const updateRequest: CustomerReqDTO =
      this.updateCustomerForm.getRawValue();

    this.loading.set(true);
    this.customerService.updateCustomer(this.customer.customerId,
      updateRequest).subscribe({
      next: (response)=>{
        this.loading.set(false);
        this.snackbar.open(response.customMessage, 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error)=>{
        const message =
          error?.error?.message ||
          'Failed to update customer. Please try again.';
        this.loading.set(false);
        this.snackbar.open(message, 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void{
    this.dialogRef.close();
  }

}
