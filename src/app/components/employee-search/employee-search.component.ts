import { LoaderService } from './../../services/loader.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchContainerComponent } from './search-container/search-container.component';
import { UserTypeService } from 'src/app/services/user-type.service';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ApiService } from 'src/app/services/api.service';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.scss']
})
export class EmployeeSearchComponent implements OnInit {
  employeeDetails: any = null;
  userType: string;
  userEmail: string;
  employeeSkills: any;

  constructor(
    private dialog: MatDialog,
    private userTypeService: UserTypeService,
    private loader: LoaderService,
    private http: ApiService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.userType = this.userTypeService.getUserType();
    this.userEmail = this.userTypeService.getUserEmailId();
  }

  openAddEmployeeDialog(data: any = "") {
    !data && (this.employeeDetails = "");
    const employeePopup = this.dialog.open(AddEmployeeComponent, {
      disableClose: true,
      panelClass: 'new-employee-popup',
      data: data
    })

    employeePopup.afterClosed().subscribe((res: any) => {
      if (res === 'record deleted') {
        this.employeeDetails = "";
      } else if (res) {
        this.employeeDetails = res;
        const skillsSplit = this.employeeDetails.skills ? this.employeeDetails.skills.split(', ') : [];
        this.employeeSkills = skillsSplit.filter((item: any) => {
          return item !== ''
        })
      }
    })
  }

  openSearchContainer() {
    const dialogRef = this.dialog.open(SearchContainerComponent, {
      disableClose: true,
      panelClass: "search-container-popup"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeDetails = result;
        const skillsSplit = this.employeeDetails.skills ? this.employeeDetails.skills.split(', ') : [];
        this.employeeSkills = skillsSplit.filter((item: any) => {
          return item !== ''
        })
      }
    });
  }

  downloadEmployeesList() {
    this.loader.show();
    this.http.downloadAllEmployeesData().subscribe((res: any) => {
      this.loader.hide();
      if (res.status === 'Success') {
        this.triggerFileDownload(res.fileUrl);
      }
    }, (err: any) => {
      this.loader.hide();
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        })
      } else {
        this.snackbar.error("Something went wrong, Please try again");
      }
    })
  }

  triggerFileDownload(url: any) {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('download', 'true');
    a.classList.add('archive-download-btn');
    document.querySelector('body')?.appendChild(a);
    a.click();
    document.querySelector('body')?.removeChild(a);
  }
}
