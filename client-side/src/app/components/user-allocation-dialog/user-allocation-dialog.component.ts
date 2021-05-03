import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThumbnailsPosition } from 'ng-gallery';

@Component({
  selector: 'addon-user-allocation-dialog',
  templateUrl: './user-allocation-dialog.component.html',
  styleUrls: ['./user-allocation-dialog.component.scss']
})
export class UserAllocationDialogComponent implements OnInit {

  title: string;
  dialogData: any;
  mode: 'Add' | 'Update' = 'Add';
  userAllocation = {
    UserUUID: '',
    ItemExternalID: '',
    WarehouseID: '',
    StartDateTime: new Date().toISOString(),
    EndDateTime: new Date().toISOString(),
    MaxAllocation: 0
  }

  constructor(public dialogRef: MatDialogRef<UserAllocationDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public incoming: any) {

    debugger;
    if (incoming && incoming.userAllocation) {
      this.userAllocation = incoming.userAllocation;
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(){
      this.dialogData = null;
  }

  onValueChanged(element, $event) {
      this.userAllocation[element] = $event.value;
  }

}