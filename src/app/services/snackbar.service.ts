import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) { }

  success(message: string): void {
    this.snackbar.open(message, 'ok', {
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: "success-message",
      duration: 4000
    })
  }

  error(message: string, time: number = 4000): void {
    this.snackbar.open(message, 'dismiss', {
      horizontalPosition: "end",
      verticalPosition: "top",
      panelClass: "error-message",
      duration: time
    })
  }

  info(message: string, h: any = 'end', v: any = 'top'): void {
    this.snackbar.open(message, 'ok', {
      horizontalPosition: h,
      verticalPosition: v,
      panelClass: "info-message",
      duration: 4000
    })
  }

  dismiss(): void {
    this.snackbar.dismiss();
  }
}
