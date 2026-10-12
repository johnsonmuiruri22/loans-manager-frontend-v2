import {Component, Inject} from '@angular/core';
import {MATERIALModule} from '../../material/material-module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AccountStatusDialogData} from '../utils/account-status-dialog-data';

@Component({
  selector: 'app-account-status-dialog-component',
  imports: [MATERIALModule],
  templateUrl: './account-status-dialog-component.html',
  styleUrl: './account-status-dialog-component.css',
})
export class AccountStatusDialogComponent {

  constructor(private dialogRef: MatDialogRef<AccountStatusDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AccountStatusDialogData) {
  }

  cancel(): void{
    this.dialogRef.close(false);
  }

  confirm(): void{
    this.dialogRef.close(true);
  }

}
