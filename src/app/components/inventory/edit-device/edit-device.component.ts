import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { formatCustomDate } from 'src/app/constants/dateformatter.constants';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UnauthorizedComponent } from '../../unauthorized/unauthorized.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})

export class EditDeviceComponent implements OnInit {
  deviceData: any;
  deviceForm: FormGroup;
  today: string;
  deviceType: string;
  deviceAssigned: boolean;
  newAttachment: boolean;
  newAttachmentValue: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private http: ApiService,
    private snackbar: SnackbarService,
    private loader: LoaderService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.deviceForm = this.fb.group({
      employee_name: [data.employee_name, [Validators.required, Validators.minLength(2)]],
      employee_id: [data.employee_id, [Validators.required, Validators.minLength(2)]],
      make: [data.make, [Validators.required, Validators.minLength(2)]],
      model: [data.model, [Validators.required, Validators.minLength(2)]],
      processor: [data.processor, [Validators.required, Validators.minLength(2)]],
      ram_size: [data.ram_size, [Validators.required, Validators.max(500), Validators.min(0.1)]],
      storage_size: [data.storage_size, [Validators.required, Validators.max(10000), Validators.min(0.1)]],
      serial_no: [data.serial_no, [Validators.required, Validators.minLength(2)]],
      asset_tag_id: [data.asset_tag_id, [Validators.required, Validators.minLength(2)]],
      warranty: [data.warranty, [Validators.required, Validators.minLength(2)]],
      agreement: [data.agreement, [Validators.required]],
      attachment: [data.attachment],
      assigned: [data.assigned, [Validators.required]],
      additional_details: [data.additional_details],
      expected_return_date: [data.expected_return_date, Validators.required],
      device_type: [data.device_type],
      file: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    this.deviceData = this.data;
    this.deviceType = this.deviceData.device_type;
    this.deviceAssigned = this.deviceData.assigned;
    this.today = formatCustomDate(new Date);
    this.handleAttachmentControl();
    if (this.data.device_type !== "laptop") {
      this.initializeMobileForm();
    } else {
      this.initializeLaptopForm();
    }
    this.toggleAssignedUserControls();
  }

  private initializeLaptopForm(): void {
    this.deviceForm.get('expected_return_date')?.disable();
  }

  private initializeMobileForm(): void {
    this.deviceForm.get('processor')?.disable();
    this.deviceForm.get('ram_size')?.disable();
    this.deviceForm.get('storage_size')?.disable();
  }

  fetchFormData(): void {
    const formValue = this.deviceForm.value;
    const payload = {
      employee_name: formValue.employee_name,
      employee_id: formValue.employee_id,
      make: formValue.make,
      model: formValue.model,
      processor: formValue.processor,
      ram_size: formValue.ram_size,
      storage_size: formValue.storage_size,
      serial_no: formValue.serial_no,
      asset_tag_id: formValue.asset_tag_id,
      warranty: formValue.warranty,
      agreement: this.deviceAssigned ? formValue.agreement : 'false',
      attachment: this.deviceData.attachment,
      assigned: this.deviceAssigned,
      additional_details: formValue.additional_details,
      last_updated_date: formatCustomDate(new Date),
      expected_return_date: formValue.expected_return_date && this.deviceAssigned && this.deviceType === 'mobile' ? formatCustomDate(formValue.expected_return_date) : '',
      device_type: this.deviceData.device_type,
    }

    const formData = new FormData();
    formData.append('employee_name', this.deviceAssigned ? formValue.employee_name : "");
    formData.append('employee_id', this.deviceAssigned ? formValue.employee_id : "");
    formData.append('make', formValue.make);
    formData.append('model', formValue.model);
    formData.append('processor', formValue.processor ? formValue.processor : "");
    formData.append('ram_size', formValue.ram_size ? formValue.ram_size : "");
    formData.append('storage_size', formValue.storage_size ? formValue.storage_size : "");
    formData.append('asset_tag_id', formValue.asset_tag_id);
    formData.append('warranty', formValue.warranty);
    formData.append('agreement', this.deviceAssigned ? formValue.agreement : 'false');
    formData.append('attachment', this.newAttachmentValue);
    formData.append('assigned', String(this.deviceAssigned));
    formData.append('additional_details', formValue.additional_details);
    formData.append('serial_no', formValue.serial_no);
    formData.append('last_updated_date', formatCustomDate(new Date));
    formData.append('expected_return_date', formValue.expected_return_date ? formatCustomDate(formValue.expected_return_date) : '');
    formData.append('device_type', this.deviceData.device_type);

    if (this.newAttachmentValue && this.newAttachmentValue.size > 2097152) {
      this.snackbar.error('Limit for file uploads is 2 MB. Kindly replace the attachment.')
    } else {
      this.loader.show();
      let currentUrl = this.router.url;
      if (this.newAttachment) {
        this.http.updateDeviceDetailsWithNewFile(formData, this.deviceData.id).subscribe((res: any) => {
          this.loader.hide();
          this.dialog.closeAll();
          this.snackbar.success('Device details updated successfully');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, (err: any) => {
          this.loader.hide();
          if (err.status === 401) {
            this.dialog.open(UnauthorizedComponent, {
              disableClose: true,
              panelClass: 'unauthorized-popup'
            })
          } else {
            this.snackbar.error('Something went wrong, try again');
          }
        })
      } else {
        this.http.updateDeviceDetails(payload, this.deviceData.id).subscribe((res: any) => {
          this.loader.hide();
          this.dialog.closeAll();
          this.snackbar.success('Device details updated successfully');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, (err: any) => {
          this.loader.hide();
          if (err.status === 401) {
            this.dialog.open(UnauthorizedComponent, {
              disableClose: true,
              panelClass: 'unauthorized-popup'
            });
          } else {
            this.snackbar.error('Something went wrong, try again');
          }
        })
      }
    }
  }

  toggleDeviceAssigned(e: any): void {
    e.checked ? this.deviceAssigned = true : this.deviceAssigned = false;
    this.toggleAssignedUserControls();
  }

  toggleAssignedUserControls(): void {
    if (this.deviceAssigned) {
      this.deviceForm.get('employee_name')?.enable();
      this.deviceForm.get('employee_id')?.enable();
      this.deviceForm.get('agreement')?.enable();
      if (this.deviceType === 'mobile') {
        this.deviceForm.get('expected_return_date')?.enable();
      }
    } else {
      this.deviceForm.get('employee_name')?.disable();
      this.deviceForm.get('employee_id')?.disable();
      this.deviceForm.get('agreement')?.disable();
      this.deviceForm.get('expected_return_date')?.disable();
    }
  }

  replaceAllWhiteSpace(e: any): void {
    e.target.value = e.target.value.replaceAll("   ", "  ").trimStart();
  }

  toggleNewAttachment(e: any): void {
    if (e.checked) {
      this.newAttachment = true
    } else {
      this.newAttachment = false;
    }
    this.handleAttachmentControl();
  }

  handleAttachmentControl(): void {
    this.deviceForm.get('file')?.setValue('');
    if (this.newAttachment) {
      this.deviceForm.get('file')?.enable();
    } else {
      this.deviceForm.get('file')?.disable();
    }
  }

  updateFileValue(e: any): void {
    this.newAttachmentValue = e.target.files[0]
  }

  clearAttachmentField(): void {
    this.deviceForm.controls['file'].setValue('');
  }

  preventNumberField(e: any): any {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.substr(0, 10);
    }
  }
}
