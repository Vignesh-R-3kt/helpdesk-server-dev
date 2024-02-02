import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main-body',
  templateUrl: './main-body.component.html',
  styleUrls: ['./main-body.component.scss']
})
export class MainBodyComponent implements OnInit, OnDestroy {

  loader: boolean = false;
  time: string;
  refreshTokenTimer: any;

  constructor(
    private handleLoader: LoaderService,
    private cdr: ChangeDetectorRef,
    private snackbar: SnackbarService,
    private http: ApiService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscribeLoaderState();
    const firtTimeLogin = sessionStorage.getItem("oldUser");
    if (firtTimeLogin === null) {
      setTimeout(() => {
        this.handleSnackBar();
      }, 500);
      sessionStorage.setItem('oldUser', 'true');
    }

    this.refreshTokenTimer = setInterval(() => {
      this.http.refreshToken().subscribe((res: any) => {

      }, (err: any) => {
        if (err.status === 401) {
          this.dialog.open(UnauthorizedComponent, {
            disableClose: true,
            panelClass: 'unauthorized-popup'
          });
          clearInterval(this.refreshTokenTimer);
        } else {
          // this.snackbar.error('Something went wrong, try again');
        }
      })
    }, 30000)
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshTokenTimer);
  }

  private subscribeLoaderState(): void {
    this.handleLoader.getLoaderState().subscribe((res: boolean) => {
      this.loader = res;
      this.cdr.detectChanges();
    })
  }

  private getUserName(): string {
    const user = JSON.parse(sessionStorage.getItem("userInfo") || "");
    return user.account.name;
  }

  private getTime(): string {
    const time = new Date().getHours();
    if (time < 12) {
      return 'Morning'
    } else if (time < 16) {
      return 'Afternoon'
    } else {
      return 'Evening'
    }
  }

  private handleSnackBar(): void {
    this.snackbar.info(`Good ${this.getTime()}, ${this.getUserName()}`, 'center', 'bottom');
  }
}