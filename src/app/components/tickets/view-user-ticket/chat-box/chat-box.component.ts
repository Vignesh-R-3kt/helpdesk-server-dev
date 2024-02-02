import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnauthorizedComponent } from 'src/app/components/unauthorized/unauthorized.component';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserTypeService } from 'src/app/services/user-type.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  ticketDetails: any;
  currentUser: string;
  newMessageFormData: FormGroup<any>;
  loadingState: boolean = false;

  @ViewChild('chatbox_popup_content_wrapper') private chatContainer!: ElementRef;

  ticketConversation: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private http: ApiService,
    private userType: UserTypeService,
    private fb: FormBuilder,
    private dialog: Dialog,
    private snackbar: SnackbarService,
    private loader: LoaderService
  ) {
    this.ticketDetails = data;
    this.newMessageFormData = this.fb.group({
      message: ["", [Validators.required, Validators.minLength(2)]]
    })
  }

  ngOnInit(): void {
    this.currentUser = this.userType.getUserEmailId();
    this.fetchAllchat();
  }

  fetchAllchat(): void {
    this.loader.show();
    this.http.fetchTicketConversation(this.ticketDetails.id).subscribe((res: any) => {
      this.ticketConversation = this.sortChatConvorsation(res);
      this.loader.hide();
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
      this.ticketDetails.unreadMsgCount = 0;
    }, (err: any) => {
      this.loader.hide();
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        })
      } else {
        this.snackbar.error('Something went wrong, try again');
      }
    });
  }

  sortChatConvorsation(arr: any[]): any[] {
    const newArr = arr.sort((a: any, b: any) => {
      const timestampA: Date = new Date(a.timestamp);
      const timestampB: Date = new Date(b.timestamp);
      return timestampA.getTime() - timestampB.getTime();
    });
    return newArr;
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (e: any) {

    }
  }

  refreshChat(): void {
    this.fetchAllchat();
  }

  fetchMessage(): void {
    const formValue = this.newMessageFormData.value;
    const payload = {
      message: formValue.message,
      timestamp: new Date(),
      email: this.userType.getUserEmailId()
    };
    this.loadingState = true;
    setTimeout(() => {
      this.scrollToBottom();
    }, 0)
    this.http.sendNewTicketConversation(this.ticketDetails.id, payload).subscribe((res: any) => {
      this.loadingState = false;
      this.ticketConversation.push(payload);
      this.newMessageFormData.reset();
      setTimeout(() => {
        this.scrollToBottom();
      }, 0)
    }, (err: any) => {
      this.loadingState = false;
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
