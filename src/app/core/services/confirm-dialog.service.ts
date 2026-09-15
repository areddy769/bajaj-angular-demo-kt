import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmText: string;
}

// Observable-based confirm dialog: caller gets true/false without callbacks.
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private requestSubject = new Subject<ConfirmRequest | null>();
  private answerSubject = new Subject<boolean>();

  /** Stream the dialog component subscribes to. */
  readonly request$ = this.requestSubject.asObservable();

  confirm(message: string, title = 'Please confirm', confirmText = 'Delete'): Observable<boolean> {
    this.requestSubject.next({ title, message, confirmText });
    return this.answerSubject.asObservable();
  }

  answer(confirmed: boolean): void {
    this.answerSubject.next(confirmed);
    this.requestSubject.next(null);
  }
}
