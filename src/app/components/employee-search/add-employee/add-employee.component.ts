import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UnauthorizedComponent } from '../../unauthorized/unauthorized.component';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  oldData: any;
  deleteState: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) private parentData: any, public dialogRef: MatDialogRef<AddEmployeeComponent>, private fb: FormBuilder, private http: ApiService, private loader: LoaderService, private snackbar: SnackbarService, private dialog: MatDialog) {
    this.employeeForm = fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      employeeId: ["", [Validators.required, Validators.minLength(3)]],
      designation: ["", [Validators.required, Validators.minLength(3)]],
      experience: ["", [Validators.required, Validators.min(0), Validators.max(50)]],
      reportingManager: ["", [Validators.required, Validators.minLength(3)]],
      mobileNumber: ["", [Validators.required, this.validatePhoneNumber]],
      project: ["", [Validators.required, Validators.minLength(3)]],
      skills: [""]
    });
    this.oldData = parentData;
  }

  ngOnInit(): void {
    this.oldData && this.updatePreviousData();
  }

  validatePhoneNumber(control: any) {
    const phoneNumberRegex = /^[0-9]{10}$/;
    return phoneNumberRegex.test(control.value) ? null : { invalidPhoneNumber: true };
  }

  updatePreviousData() {
    this.employeeForm.get('name')?.setValue(this.oldData.name);
    this.employeeForm.get('email')?.setValue(this.oldData.email);
    this.employeeForm.get('mobileNumber')?.setValue(this.oldData.mobileNumber);
    this.employeeForm.get('employeeId')?.setValue(this.oldData.employeeId);
    this.employeeForm.get('project')?.setValue(this.oldData.project);
    this.employeeForm.get('reportingManager')?.setValue(this.oldData.reportingManager);
    this.employeeForm.get('designation')?.setValue(this.oldData.designation);
    this.employeeForm.get('experience')?.setValue(this.oldData.experience);
    this.employeeForm.get('skills')?.setValue(this.oldData.skills);
  }

  submitFormDetails() {
    const formValue = this.employeeForm.value;
    const payload = {
      name: formValue.name,
      email: formValue.email,
      mobileNumber: formValue.mobileNumber,
      employeeId: formValue.employeeId.toLowerCase(),
      project: formValue.project,
      reportingManager: formValue.reportingManager,
      designation: formValue.designation,
      experience: formValue.experience,
      skills: formValue.skills
    }
    this.loader.show();
    this.http.addNewEmployee(payload).subscribe((res: any) => {
      this.loader.hide();
      this.snackbar.success("New employee added successfully.");
      this.dialog.closeAll();
    }, (err: any) => {
      this.loader.hide()
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        })
      } else if (err.status === 400 && err.error.message && err.error.message === "email already exist") {
        this.snackbar.error("The EMAIL ADDRESS is already associated with another employee's account.");
      } else if (err.status === 400 && err.error.message && err.error.message === "mobile number already exist") {
        this.snackbar.error("The PHONE NUMBER is already associated with another employee's account.");
      } else if (err.status === 400 && err.error.message && err.error.message === "employee id already exist") {
        this.snackbar.error("The EMPLOYEE ID is already associated with another employee's account.");
      } else {
        this.snackbar.error('Something went wrong, try again');
      }
    })
  }

  updateFormDetails() {
    const formValue = this.employeeForm.value;
    const payload = {
      name: formValue.name,
      email: formValue.email,
      mobileNumber: String(formValue.mobileNumber),
      employeeId: formValue.employeeId.toLowerCase(),
      project: formValue.project,
      reportingManager: formValue.reportingManager,
      designation: formValue.designation,
      experience: String(formValue.experience),
      skills: formValue.skills
    }
    this.loader.show();
    this.http.updateEmployeeDetails(payload, this.oldData.id).subscribe((res: any) => {
      this.loader.hide();
      this.snackbar.success("Updated employee details successfully");
      this.dialog.closeAll();
      this.dialogRef.close({ ...payload, id: this.parentData.id });
    }, (err: any) => {
      this.loader.hide();
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        })
      } else if (err.status === 400 && err.error.message && err.error.message === "email already exist") {
        this.snackbar.error("The EMAIL ADDRESS is already associated with another employee's account.");
      } else if (err.status === 400 && err.error.message && err.error.message === "mobile number already exist") {
        this.snackbar.error("The PHONE NUMBER is already associated with another employee's account.");
      } else if (err.status === 400 && err.error.message && err.error.message === "employee id already exist") {
        this.snackbar.error("The EMPLOYEE ID is already associated with another employee's account.");
      } else {
        this.snackbar.error('Something went wrong, try again');
      }
    })
  }

  handleDeleteUser() {
    this.loader.show();
    this.http.deleteEmployeeDetails(this.oldData.id).subscribe((res: any) => {
      this.dialog.closeAll();
      this.loader.hide();
      this.snackbar.error('Employee record deleted successfully');
      this.dialogRef.close('record deleted');
    },
      (err: any) => {
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
  }

  replaceAllWhiteSpace(e: any): void {
    e.target.value = e.target.value.replaceAll('   ', '  ').trimStart();
  }
}
