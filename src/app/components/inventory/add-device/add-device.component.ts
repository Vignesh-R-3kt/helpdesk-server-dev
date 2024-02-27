import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { formatCustomDate } from 'src/app/constants/dateformatter.constants';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UnauthorizedComponent } from '../../unauthorized/unauthorized.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})

export class AddDeviceComponent implements OnInit {
  today: any;
  newDeviceType: string = 'laptop';
  deviceAssigned: boolean;
  deviceForm: FormGroup;
  attachmentFile: any;

  constructor(
    private fb: FormBuilder,
    private http: ApiService,
    private loader: LoaderService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.deviceForm = this.fb.group({
      employeeName: ['', [Validators.required, Validators.minLength(2)]],
      employeeId: ['', [Validators.required, Validators.minLength(2)]],
      make: ['', [Validators.required, Validators.minLength(2)]],
      model: ['', [Validators.required, Validators.minLength(2)]],
      processor: ['', [Validators.required, Validators.minLength(2)]],
      ramSize: ['', [Validators.required, Validators.max(500), Validators.min(0.1)]],
      storageSize: ['', [Validators.required, Validators.max(10000), Validators.min(0.1)]],
      serialNo: ['', [Validators.required, Validators.minLength(2)]],
      assetTagId: ['', [Validators.required, Validators.minLength(2)]],
      warranty: ['', [Validators.required, Validators.minLength(2)]],
      agreement: ['', [Validators.required]],
      expectedReturnDate: ['', [Validators.required]],
      additionalDetails: [''],
      file: [''],
      assigned: [false]
    })
  }

  ngOnInit(): void {
    this.setCurrentDate();
    this.disableLaptopFormfields();
    this.handlePreviousUserFormControls(false);
  }

  private disableMobileFormFields(): void {
    this.deviceForm.get('processor')?.disable();
    this.deviceForm.get('ramSize')?.disable();
    this.deviceForm.get('storageSize')?.disable();
    this.deviceForm.get('expectedReturnDate')?.disable();
  }

  private disableLaptopFormfields(): void {
    this.deviceForm.get('processor')?.enable();
    this.deviceForm.get('ramSize')?.enable();
    this.deviceForm.get('storageSize')?.enable();
    this.deviceForm.get('expectedReturnDate')?.disable();
  }

  private setCurrentDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    setTimeout(() => {
      this.today = `${year}-${month}-${day}`;
    }, 0)
  }

  submitForm(): void {
    const formValue = this.deviceForm.value;
    const payload = {
      employeeName: formValue.employeeName ? formValue.employeeName.replaceAll('  ', ' ') : '',
      employeeId: formValue.employeeId ? formValue.employeeId : '',
      make: formValue.make,
      model: formValue.model,
      processor: formValue.processor ? formValue.processor : '',
      ramSize: formValue.ramSize ? formValue.ramSize : '',
      storageSize: formValue.storageSize ? formValue.storageSize : '',
      serialNo: formValue.serialNo.toUpperCase(),
      assetTagId: formValue.assetTagId.toUpperCase(),
      warranty: formValue.warranty,
      agreement: formValue.agreement && formValue.assigned ? formValue.agreement : 'false',
      attachment: this.attachmentFile ? this.attachmentFile : '',
      assigned: formValue.assigned,
      additionalDetails: formValue.additionalDetails ? formValue.additionalDetails : '',
      lastUpdatedDate: "",
      expectedReturnDate: formValue.expectedReturnDate && this.deviceAssigned && this.newDeviceType === 'mobile' ? formatCustomDate(formValue.expectedReturnDate) : '',
      deviceType: this.newDeviceType,
    };

    const formData = new FormData();

    formData.append('deviceType', payload.deviceType);
    formData.append('employeeName', payload.employeeName);
    formData.append('employeeId', payload.employeeId);
    formData.append('make', payload.make);
    formData.append('model', payload.model);
    formData.append('processor', payload.processor);
    formData.append('ramSize', payload.ramSize);
    formData.append('storageSize', payload.storageSize);
    formData.append('serialNo', payload.serialNo);
    formData.append('assetTagId', payload.assetTagId);
    formData.append('warranty', payload.warranty);
    formData.append('agreement', payload.agreement);
    formData.append('attachment', payload.attachment);
    formData.append('assigned', payload.assigned);
    formData.append('additionalDetails', payload.additionalDetails);
    formData.append('lastUpdatedDate', payload.lastUpdatedDate);
    formData.append('expectedReturnDate', payload.expectedReturnDate);

    if (payload.attachment && payload.attachment.size > 2097152) {
      this.snackbar.error('Limit for file uploads is 2 MB. Kindly replace the attachment.')
    } else {
      this.loader.show();
      let currentUrl = this.router.url;
      if (this.attachmentFile) {
        this.http.addDeviceWithAttachment(formData).subscribe((res: any) => {
          this.deviceForm.reset();
          this.loader.hide();
          this.dialog.closeAll();
          this.snackbar.success('Device added successfully');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, (err: any) => {
          this.loader.hide()
          if (err.status === 401) {
            this.dialog.open(UnauthorizedComponent, {
              disableClose: true,
              panelClass: 'unauthorized-popup'
            })
          } else if (err.status === 400 && err.error.message && err.error.message === 'serial number already exist') {
            this.snackbar.error('Serial number already used with different device.');
          } else if (err.status === 400 && err.error.message && err.error.message === 'asset tag id already exist') {
            this.snackbar.error('Asset tag id already used with different device.');
          } else {
            this.snackbar.error('Something went wrong, try again');
          }
        })
      } else {
        this.http.AddDeviceWithoutAttachment(formData).subscribe((res: any) => {
          this.deviceForm.reset();
          this.loader.hide();
          this.dialog.closeAll();
          this.snackbar.success('Device added successfully');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }, (err: any) => {
          this.loader.hide()
          if (err.status === 401) {
            this.dialog.open(UnauthorizedComponent, {
              disableClose: true,
              panelClass: 'unauthorized-popup'
            })
          } else if (err.status === 400 && err.error.message && err.error.message === 'serial number already exist') {
            this.snackbar.error('Serial number already used with different device.');
          } else if (err.status === 400 && err.error.message && err.error.message === 'asset tag id already exist') {
            this.snackbar.error('Asset tag id already used with different device.');
          } else {
            this.snackbar.error('Something went wrong, try again');
          }
        })
      }
    }


  }

  updateAttachementFile(e: any): void {
    const inputFile = e.target.files[0];
    this.attachmentFile = inputFile;
  }

  updateNewDeviceType(e: any): void {
    this.newDeviceType = e.value;
    this.deviceForm.reset();
    this.deviceForm.get('assigned')?.setValue(false);
    this.deviceAssigned = false;
    if (e.value === 'laptop') {
      this.disableLaptopFormfields();
    } else {
      this.disableMobileFormFields();
    }
  }

  togglePreviousUserData(e: any): void {
    this.deviceAssigned = e.checked;
    e.checked ? this.handlePreviousUserFormControls(true) : this.handlePreviousUserFormControls(false)
  }

  private handlePreviousUserFormControls(enable: boolean): void {
    if (enable) {
      this.deviceForm.get('employeeName')?.enable();
      this.deviceForm.get('employeeId')?.enable();
      this.deviceForm.get('agreement')?.enable();
      if (this.newDeviceType === 'mobile') {
        this.deviceForm.get('expectedReturnDate')?.enable();
      }
    } else {
      this.deviceForm.get('employeeName')?.disable();
      this.deviceForm.get('employeeId')?.disable();
      this.deviceForm.get('agreement')?.disable();
      this.deviceForm.get('expectedReturnDate')?.disable();
    }
  }

  clearFileInput(): void {
    this.deviceForm.get('file')?.setValue('');
    this.attachmentFile = '';
  }

  replaceAllWhiteSpace(e: any): void {
    e.target.value = e.target.value.replaceAll('   ', '  ').trimStart();
  }

  preventDoubleSpace(e: any): void {
    if (e.target.value.substr(-1) === ' ' && e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();
    }
  }

  preventNumberField(e: any): any {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.substr(0, 10);
    }
  }
}
