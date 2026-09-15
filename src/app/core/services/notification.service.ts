import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

let nextId = 1;

// Tiny toast store — components never call alert(); they push through here.
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  success(message: string): void {
    this.push('success', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }

  private push(type: Toast['type'], message: string): void {
    const toast: Toast = { id: nextId++, type, message };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    // Auto-dismiss so trainees don't need to wire it everywhere.
    setTimeout(() => this.dismiss(toast.id), 4000);
  }
}
