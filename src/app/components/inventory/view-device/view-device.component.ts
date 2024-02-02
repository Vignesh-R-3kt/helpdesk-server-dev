import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EditDeviceComponent } from '../edit-device/edit-device.component';

@Component({
  selector: 'app-view-device',
  templateUrl: './view-device.component.html',
  styleUrls: ['./view-device.component.scss']
})

export class ViewDeviceComponent implements OnInit {

  dialogData: any = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dialogData = this.data;
  }

  openEditDialog(): void {
    this.dialog.closeAll();
    this.dialog.open(EditDeviceComponent, {
      data: this.data,
      disableClose: true
    })
  }
}
