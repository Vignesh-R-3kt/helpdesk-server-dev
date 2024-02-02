import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NewTicketComponent } from '../new-ticket/new-ticket.component';
import { TicketsComponent } from '../tickets/tickets.component';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { MainBodyComponent } from './main-body.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { ServiceRequestComponent } from '../service-request/service-request.component';

const route: Routes = [
  {
    path: "", component: MainBodyComponent, children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'new-ticket', component: NewTicketComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'service-request', component: ServiceRequestComponent },
      { path: '**', redirectTo: 'dashboard' },
    ]
  },
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(route)
  ],
  exports: [RouterModule]
})
export class MainBodyRoutingModule { }
