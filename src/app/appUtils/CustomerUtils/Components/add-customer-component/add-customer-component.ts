import {Component, OnInit} from '@angular/core';
import {MATERIALModule} from '../../../../modules/material/material-module';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomerService} from '../../../../SERVICES/CustomerService/customer-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomerReqDTO} from '../../Utils/customer-req-dto';
import {AppResponse} from '../../../AppResponse/app-response';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-customer-component',
  imports: [MATERIALModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-customer-component.html',
  styleUrl: './add-customer-component.css',
})
export class AddCustomerComponent implements OnInit{

  customerForm!: FormGroup;
  isLoading: boolean = false;
  today = new Date();

  constructor(private fb: FormBuilder, private customerService: CustomerService,
              private snackbar: MatSnackBar, private dialogRef: MatDialogRef<AddCustomerComponent>) {
    this.customerForm = this.fb.group({
      surname: [''],
      firstname: ['',Validators.required],
      lastname: ['',Validators.required],
      gender: ['',Validators.required],
      dob: ['',Validators.required],
      phone: ['',Validators.required,Validators.pattern(/^0[17]\d{8}$/)],
      email: ['',Validators.required, Validators.email],
      residence: ['',Validators.required],
      occupation: ['',Validators.required],
      monthlyIncome: ['',Validators.required]
    });
  }

  ngOnInit() {
  }

  onSubmit(){
    if (this.customerForm.invalid) return;
    this.isLoading = true;
    const formValue = this.customerForm.value as CustomerReqDTO;
    this.customerService.addCustomer(formValue).subscribe({
      next: (response: AppResponse)=>{
        this.isLoading = false;
        this.snackbar.open(response.message, 'Close', {duration: 3000});
        this.dialogRef.close(response.customerToGet);
      },
      error: (error: any)=>{
        this.isLoading = false;
        this.snackbar.open(error.error.message, 'Close', {duration: 3000});
        this.resetForm();
      }
    });
  }

  resetForm(){
    this.customerForm.reset();
  }

  onCancel(){
    this.resetForm();
    this.dialogRef.close();
  }
}
