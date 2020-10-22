import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize, delay } from "rxjs/operators";
import { BusyService } from "./busy.service";

@Injectable()
export class BusyHttpInterceptor implements HttpInterceptor {
  constructor(private readonly busyService: BusyService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const message = request.method === "GET" ? "Loading..." : "Saving...";
    this.busyService.increment(message);

    return next.handle(request).pipe(
      delay(700), // for testing
      finalize(() => {
        this.busyService.decrement();
      })
    );
  }
}
