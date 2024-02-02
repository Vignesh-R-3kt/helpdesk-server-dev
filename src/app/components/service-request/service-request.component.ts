import { Dialog } from '@angular/cdk/dialog';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatCustomDate } from 'src/app/constants/dateformatter.constants';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewMailComponent } from './review-mail/review-mail.component';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss']
})
export class ServiceRequestComponent implements OnInit {

  serviceRequestForm: FormGroup;
  startMindate: any;
  endMindate: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.serviceRequestForm = this.fb.group({
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      endTime: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.startMindate = this.ngDateFormat(new Date);
    this.endMindate = this.startMindate;
  }

  getFormValues(): void {
    const payload = {
      subject: this.serviceRequestForm.value.subject,
      message: this.serviceRequestForm.value.message,
      startDate: formatCustomDate(this.serviceRequestForm.value.startDate),
      startTime: this.serviceRequestForm.value.startTime,
      endDate: formatCustomDate(this.serviceRequestForm.value.endDate),
      endTime: this.serviceRequestForm.value.endTime
    };

    this.dialog.open(ReviewMailComponent, {
      data: payload
    })
  }

  updateEndMinDate(): void {
    const startDate = this.serviceRequestForm.get('startDate')?.value;
    this.endMindate = this.ngDateFormat(startDate);
  }

  ngDateFormat(date: any): string {
    const customdate = new Date(date);
    return `${customdate.getFullYear()}-${(customdate.getMonth() + 1).toString().padStart(2, '0')}-${customdate.getDate().toString().padStart(2, ' 0')}`;
  }

}
