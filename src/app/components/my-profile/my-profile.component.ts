import { SnackbarService } from './../../services/snackbar.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { UserTypeService } from 'src/app/services/user-type.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {
  userDetails: any;
  userProfileDetails: any;
  userType: string;
  skillEditMode: boolean = false;
  skills: string;

  constructor(private http: ApiService, private dialog: MatDialog, private UserTypeService: UserTypeService, private loader: LoaderService, private snackbar: SnackbarService) { }

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem("userInfo") || "");
    if (user) {
      this.userDetails = user.account;
      this.fetchUserDetails();
    }
    this.userType = this.UserTypeService.getUserType();
  }

  fetchUserDetails() {
    this.loader.show();
    this.http.getEmployeeDetails().subscribe((res: any) => {
      this.loader.hide();
      if (res) {
        this.userProfileDetails = res;
        this.skills = res.skills;
      }
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

  updateSkillsValue() {
    const payload = {
      skills: this.skills.trim().replaceAll(/  +/g, ' '),
    }
    this.loader.show();
    this.http.updateEmployeeDetails(payload, this.userProfileDetails.id).subscribe((res: any) => {
      this.skillEditMode = false;
      this.loader.hide();
      this.snackbar.success("Skills updated successfully");
    }, (err: any) => {
      this.loader.hide()
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        })
      } else {
        this.snackbar.error('Something went wrong, try again');
      };
    })
  }
}
