import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class FeedbackService {
  constructor(private snackBar: MatSnackBar) {}

  success(msg: string) {
    this.snackBar.open(msg);
  }

  error(msg: string) {
    this.snackBar.open(msg);
  }
}
