import { InventoryComponent } from './../inventory/inventory.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainBodyRoutingModule } from './main-body-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NewTicketComponent } from '../new-ticket/new-ticket.component';
import { TicketsComponent } from '../tickets/tickets.component';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatesPipe } from 'src/app/pipes/dates.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { ViewDeviceComponent } from '../inventory/view-device/view-device.component';
import { AddDeviceComponent } from '../inventory/add-device/add-device.component';
import { EditDeviceComponent } from '../inventory/edit-device/edit-device.component';
import { ReviewUserTicketComponent } from '../new-ticket/review-user-ticket/review-user-ticket.component';
import { ViewUserTicketComponent } from '../tickets/view-user-ticket/view-user-ticket.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { SuccessMessageComponent } from '../new-ticket/review-user-ticket/success-message/success-message.component';
import { RejectTicketComponent } from '../tickets/view-user-ticket/reject-ticket/reject-ticket.component';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResolveTicketComponent } from '../tickets/view-user-ticket/resolve-ticket/resolve-ticket.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ChatBoxComponent } from '../tickets/view-user-ticket/chat-box/chat-box.component';
import { ServiceRequestComponent } from '../service-request/service-request.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ReviewMailComponent } from '../service-request/review-mail/review-mail.component';
import { EmployeeSearchComponent } from '../employee-search/employee-search.component';
import { SearchContainerComponent } from '../employee-search/search-container/search-container.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddEmployeeComponent } from '../employee-search/add-employee/add-employee.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NewTicketComponent,
    TicketsComponent,
    MyProfileComponent,
    InventoryComponent,
    ViewDeviceComponent,
    AddDeviceComponent,
    EditDeviceComponent,
    ReviewUserTicketComponent,
    ViewUserTicketComponent,
    DatesPipe,
    SuccessMessageComponent,
    RejectTicketComponent,
    UnauthorizedComponent,
    ResolveTicketComponent,
    ChatBoxComponent,
    ServiceRequestComponent,
    ReviewMailComponent,
    EmployeeSearchComponent,
    SearchContainerComponent,
    AddEmployeeComponent
  ],
  imports: [
    CommonModule,
    MainBodyRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRippleModule,
    MatTooltipModule,
    MatBadgeModule,
    NgxMatTimepickerModule,
    FormsModule,
    MatProgressSpinnerModule
  ]
})
export class MainBodyModule { }
