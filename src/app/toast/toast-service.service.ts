import { Injectable } from '@angular/core';
import {  Subject } from 'rxjs';
export class ToastState{
  isError: boolean;
  msg: string;
}
@Injectable({
  providedIn: 'root'
})
export class ToastService {
private readonly messageSubject = new Subject<ToastState>();
readonly toastState$ = this.messageSubject.asObservable();
  
propogate(isError: boolean, msg: string){
  const state: ToastState = {isError, msg};
  this.messageSubject.next(state)
}
}
