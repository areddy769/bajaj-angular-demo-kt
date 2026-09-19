import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pendingRequests = new BehaviorSubject<number>(0);

  readonly loading$: Observable<boolean> = this.pendingRequests.pipe(map((n) => n > 0));

  show(): void {
    this.pendingRequests.next(this.pendingRequests.value + 1);
  }

  hide(): void {
    const next = Math.max(0, this.pendingRequests.value - 1);
    this.pendingRequests.next(next);
  }
}