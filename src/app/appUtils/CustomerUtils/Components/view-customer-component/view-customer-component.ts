import {Component, Inject, OnInit} from '@angular/core';
import {MATERIALModule} from '../../../../modules/material/material-module';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CustomerRespDTO} from '../../Utils/customer-resp-dto';

@Component({
  selector: 'app-view-customer-component',
  imports: [MATERIALModule, CommonModule],
  templateUrl: './view-customer-component.html',
  styleUrl: './view-customer-component.css',
})
export class ViewCustomerComponent{

  constructor(private dialogRef: MatDialogRef<ViewCustomerComponent>,
              @Inject(MAT_DIALOG_DATA) public customer: CustomerRespDTO) {
  }
  closeDialog(){
    this.dialogRef.close();
  }

}
