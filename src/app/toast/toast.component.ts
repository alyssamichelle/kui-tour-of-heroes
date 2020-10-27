import { ToastService, ToastState } from "./toast-service.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NotificationService } from "@progress/kendo-angular-notification";

@Component({
  selector: "app-toast",
  template: `<ng-template #template>{{msg}}</ng-template>`, 
})
export class ToastComponent implements OnInit {
  @ViewChild('template', { read: TemplateRef })
  public notificationTemplate: TemplateRef<any>;
  msg: string;
  constructor(
    private readonly toastService: ToastService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.toastService.toastState$.subscribe((state: ToastState) => {
      if(state.msg.length ===0) return;
      let style:
        | "error"
        | "success"
        | "none"
        | "warning"
        | "info" = state.isError ? "error" : "success";
      this.msg = state.msg;
      this.notificationService.show({
        content: this.notificationTemplate,
        position: { horizontal: "center", vertical: "bottom" },
        animation: { type: "fade", duration: 400 },
        type: { style: style, icon: true }
      });
    });
  }
}
