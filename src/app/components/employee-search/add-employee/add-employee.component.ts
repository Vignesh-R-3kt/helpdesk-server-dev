import { UserTypeService } from 'src/app/services/user-type.service';
import { Component, ElementRef, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UnauthorizedComponent } from '../../unauthorized/unauthorized.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  oldData: any;
  deleteState: boolean = false;
  skills: any[] = [];
  allSkills: string[] = [];
  skillsCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSkills: Observable<string[]>;
  userType: any;
  userEmail: any;
  @ViewChild('skillInput') fruitInput: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  constructor(@Inject(MAT_DIALOG_DATA) private parentData: any, public dialogRef: MatDialogRef<AddEmployeeComponent>, private fb: FormBuilder, private http: ApiService, private loader: LoaderService, private snackbar: SnackbarService, private dialog: MatDialog, private userTypeService: UserTypeService) {
    this.employeeForm = fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      email: ["@3ktechnologies.com", [Validators.required, Validators.email]],
      employeeId: ["", [Validators.required, Validators.minLength(3)]],
      designation: ["", [Validators.required, Validators.minLength(3)]],
      experience: ["", [Validators.required, Validators.min(0), Validators.max(50)]],
      reportingManager: ["", [Validators.required, Validators.minLength(3)]],
      mobileNumber: ["", [Validators.required, this.validatePhoneNumber]],
      project: ["", [Validators.required, Validators.minLength(3)]],
    });
    this.oldData = parentData;
    this.filteredSkills = this.skillsCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allSkills.slice())),
    );
  }

  ngOnInit(): void {
    this.oldData && this.updatePreviousData();
    this.getSkillsData();
    this.userType = this.userTypeService.getUserType();
    this.userEmail = this.userTypeService.getUserEmailId();
  }

  getSkillsData() {
    this.loader.show();
    this.http.getAllSkillslist().subscribe((res: any) => {
      this.allSkills = res.skills;
      this.loader.hide();
    }, (err: any) => {
      this.loader.hide();
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        })
      }
    })
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
    this.skills = this.oldData.skills ? this.oldData.skills.split(', ') : [];
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
      skills: this.skills.join(", "),
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
      skills: this.skills.join(', ')
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


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.skills.push(value);
    }
    event.chipInput!.clear();
    this.skillsCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.skills.indexOf(fruit);
    if (index >= 0) {
      this.skills.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  selected(event: any): void {
    this.skills.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.skillsCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allSkills.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
}
