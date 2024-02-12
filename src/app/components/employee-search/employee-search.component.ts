import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchContainerComponent } from './search-container/search-container.component';
import { UserTypeService } from 'src/app/services/user-type.service';
import { AddEmployeeComponent } from './add-employee/add-employee.component';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.scss']
})
export class EmployeeSearchComponent implements OnInit {
  employeeDetails: any = null;
  userType: string;
  userEmail: string;

  constructor(
    private dialog: MatDialog,
    private userTypeService: UserTypeService
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
      }
    });
  }
}
