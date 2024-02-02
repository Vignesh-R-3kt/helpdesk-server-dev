import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewUserTicketComponent } from './review-user-ticket/review-user-ticket.component';
import { MatDialog } from '@angular/material/dialog';
import { formatCustomDate } from 'src/app/constants/dateformatter.constants';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.scss']
})

export class NewTicketComponent implements OnInit {
  today: any = "";
  formInputValue: any = {};
  ticketForm: FormGroup;
  isFileTooLarge: boolean = false;
  isIncorrectFileFormat: boolean = false;
  attachmentName: string;
  dropDownValue: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private http: ApiService,
    private loader: LoaderService,
    private snackbar: SnackbarService
  ) {
    this.ticketForm = this.fb.group({
      subject: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      date: [{ value: "", disabled: true }],
      priority: ["", Validators.required],
      category: ["", Validators.required],
      description: ["", [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      file: [""]
    })
  }

  ngOnInit(): void {
    this.setCurrentDate();
    this.getDropDownData();
  }

  private setCurrentDate(): void {
    setTimeout(() => {
      this.today = formatCustomDate(new Date);
    }, 0)
  }

  getDropDownData() {
    this.loader.show();
    this.http.getDropDownData().subscribe((res: any) => {
      this.dropDownValue = res;
      this.loader.hide();
    }, (err: any) => {
      this.loader.hide();
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        });
      } else {
        this.snackbar.error('Something went wrong, try refreshing page.');
      }
    })
  }

  fetchFormDetails(): void {
    const formDetails = this.ticketForm.value;
    this.formInputValue.subject = formDetails.subject;
    this.formInputValue.date = new Date();
    this.formInputValue.priority = formDetails.priority;
    this.formInputValue.category = formDetails.category;
    this.formInputValue.description = formDetails.description;
    this.openReviewDialog(this.formInputValue)
  }

  openReviewDialog(inputData: any) {
    this.dialog.open(ReviewUserTicketComponent, {
      data: inputData,
      disableClose: true
    })
  }

  updateUploadFile(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedExtensions = /(\.png|\.jpeg|\.jpg)$/i;
      const fileSizeLimit = 1024 * 1024;
      if (!allowedExtensions.exec(file.name)) {
        this.isIncorrectFileFormat = true;
        this.isFileTooLarge = false;
        this.clearFileInput();
      } else {
        if (file.size > fileSizeLimit) {
          this.isFileTooLarge = true;
          this.isIncorrectFileFormat = false;
          this.clearFileInput();
        } else {
          this.formInputValue.file = file;
          this.formInputValue.preview = URL.createObjectURL(file);
          this.isIncorrectFileFormat = false;
          this.isFileTooLarge = false;
          this.attachmentName = this.formInputValue.file.name
        }
      }
    }
  }

  clearFileInput(): void {
    this.ticketForm.get('file')?.setValue('');
    this.formInputValue.preview = "";
    this.formInputValue.file = "";
  }

  replaceWhiteSpace(e: any): void {
    e.target.value = e.target.value.replace(/ {3}/g, ' ').trimStart();
  }

  removeEnterSpace(e: any): void {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }
}
