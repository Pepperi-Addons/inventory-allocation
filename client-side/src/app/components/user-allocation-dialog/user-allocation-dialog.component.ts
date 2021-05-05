import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'addon-user-allocation-dialog',
  templateUrl: './user-allocation-dialog.component.html',
  styleUrls: ['./user-allocation-dialog.component.scss']
})
export class UserAllocationDialogComponent implements OnInit {

  title: string;
  mode: 'Add' | 'Update' = 'Add';
  userAllocation = {
    UserID: '',
    ItemExternalID: '',
    WarehouseID: '',
    StartDateTime: new Date().toISOString(),
    EndDateTime: new Date().toISOString(),
    MaxAllocation: 0,
    UsedAllocation: 0
  }

  constructor(public dialogRef: MatDialogRef<UserAllocationDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public incoming: any) {

    if (incoming && incoming.userAllocation) {
      this.userAllocation = incoming.userAllocation;
      this.mode = 'Update';
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(){
  }

  getDateValue(str: string) {
    return new Date(str).toUTCString()
  }

  onValueChanged(key, value) {
      this.userAllocation[key] = value;
  }

  onNumberChange(key, value) {
    this.userAllocation[key] = Number(value);
  }

  onDateChange(key, value) {
    this.userAllocation[key] = new Date(value).toISOString();
  }

}