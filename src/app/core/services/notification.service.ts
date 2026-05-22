import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly defaultDuration = 4000;

  constructor(private readonly snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: this.defaultDuration,
      panelClass: ['snackbar-success'],
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: this.defaultDuration,
      panelClass: ['snackbar-error'],
    });
  }

  warning(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: this.defaultDuration,
      panelClass: ['snackbar-warning'],
    });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: this.defaultDuration,
      panelClass: ['snackbar-info'],
    });
  }
}
