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
  userSkills: any;

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
        const skillsData = res.skills ? res.skills.split(", ") : [];
        this.userSkills = skillsData.filter((skill: any) => {
          if (skill !== '') {
            return skill;
          }
        })
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
}
