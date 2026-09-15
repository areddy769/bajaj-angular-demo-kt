import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Global spinner state driven by LoadingInterceptor's request counter.
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pendingRequests = new BehaviorSubject<number>(0);

  /** Emits true while at least one HTTP request is in flight. */
  readonly loading$: Observable<boolean> = this.pendingRequests.pipe(map((n) => n > 0));

  show(): void {
    this.pendingRequests.next(this.pendingRequests.value + 1);
  }

  hide(): void {
    const next = Math.max(0, this.pendingRequests.value - 1);
    this.pendingRequests.next(next);
  }
}
