import { SnackbarService } from 'src/app/services/snackbar.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDeviceComponent } from './add-device/add-device.component';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { ViewDeviceComponent } from './view-device/view-device.component';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})

export class InventoryComponent implements OnInit {
  dt0ptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    destroy: true
  };
  currentDeviceType: string = 'laptop';
  filteredDevice: any[];
  deviceStatus: string = 'true';
  devicesTableData: any[] = [];

  constructor(
    private dialog: MatDialog,
    private http: ApiService,
    private snackbar: SnackbarService,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.fetchAllDeviceData();
    this.dt0ptions = {
      pagingType: 'full_numbers',
      processing: true,
      destroy: true,
      columnDefs: [
        {
          'searchable': false,
          'targets': [0, 13]
        }
      ]
    };
    this.filterDevice();
  }

  private fetchAllDeviceData(): void {
    this.loader.show();
    this.http.fetchAllDevices().subscribe((res: any) => {
      this.devicesTableData = res;
      this.filterDevice();
      this.loader.hide();
    }, (err: any) => {
      this.loader.hide()
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        })
      } else {
        this.snackbar.error('Something went wrong, try again');
      }
    })
  }

  private filterDevice(type: string = this.currentDeviceType, status: string = this.deviceStatus): void {
    $('#devices-table').DataTable().destroy();
    const deviceStatus = status === 'true' ? true : false;
    this.filteredDevice = this.devicesTableData.filter(device => device.deviceType === type && device.assigned === deviceStatus);
    this.reinitializeTable();
  }

  private reinitializeTable(): void {
    setTimeout(() => {
      $('#devices-table').DataTable({
        pagingType: 'full_numbers',
        processing: true,
        destroy: true,
        columnDefs: [
          {
            'searchable': false,
            'targets': [0, 13]
          }
        ]
      });
    }, 0);
  }

  changeDeviceType(e: any): void {
    this.currentDeviceType = e.value;
    this.filterDevice();
    this.reinitializeTable();
  }

  changeDeviceStatus(e: any): void {
    this.deviceStatus = e.value;
    this.filterDevice();
    this.reinitializeTable();
  }

  openViewDialog(data: any): void {
    this.dialog.open(ViewDeviceComponent, {
      data: data,
      autoFocus: false
    });
  }

  openEditDialog(data: any): void {
    this.dialog.open(EditDeviceComponent, {
      data: data,
      disableClose: true
    });
  }

  openAddDeviceDialog(): void {
    this.dialog.open(AddDeviceComponent, {
      disableClose: true
    });
  }

  downloadAllInventoryData(): void {
    this.loader.show();
    this.http.downloadAllInventoryData().subscribe((res: any) => {
      this.loader.hide();
      this.triggerArchiveFileDownload(res.fileUrl);
    }, (err: any) => {
      this.loader.hide();
    })
  }

  triggerArchiveFileDownload(link: string) {
    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    a.setAttribute('download', 'true');
    a.classList.add('archive-download-btn');
    document.querySelector('body')?.appendChild(a);
    a.click();
    document.querySelector('body')?.removeChild(a);
  }
}
