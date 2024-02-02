import { UserTypeService } from 'src/app/services/user-type.service';
import { navItemsConstant } from './../../constants/navbar.constants';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  navItems: any[];
  filteredNavItems: any[];
  userType: string;

  constructor(
    private userTypeservice: UserTypeService
  ) { }

  ngOnInit(): void {
    this.navItems = navItemsConstant;
    this.userType = this.userTypeservice.getUserType();
    this.filteredNavItems = this.navItems.filter(item => item.roles.includes(this.userType));
    if (this.userType === 'admin' || this.userType === 'hr' || this.userType === 'hradmin') {
      this.filteredNavItems = this.filteredNavItems.map((item) => {
        if (item.path === 'tickets') {
          return { ...item, name: 'All Tickets' };
        } else {
          return item;
        }
      })
    }
  }
}
