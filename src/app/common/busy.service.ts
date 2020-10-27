import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';  
import { BusyState } from './busy-state.interface';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  private readonly messageSubject = new BehaviorSubject<BusyState>({ isBusy: false, message: null });
  readonly busyState$ = this.messageSubject.asObservable();

  increment(newMessage: string) {
    const state: BusyState = { isBusy: true, message: newMessage }
    this.messageSubject.next(state);
  }
  decrement() {
    this.messageSubject.next(null);
  }
}