import {BusyHttpInterceptor} from './common/busy-http-interceptor';

import {ElementRef, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './in-memory-data.service';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HeroDetailComponent} from './hero-detail/hero-detail.component';
import {HeroesComponent} from './heroes/heroes.component';
import {HeroSearchComponent} from './hero-search/hero-search.component';
import {MessagesComponent} from './messages/messages.component';

import {InputsModule} from '@progress/kendo-angular-inputs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LabelModule} from '@progress/kendo-angular-label';
import {ButtonsModule} from '@progress/kendo-angular-buttons';
import {LayoutModule} from '@progress/kendo-angular-layout';
import {DropDownsModule} from '@progress/kendo-angular-dropdowns';
import {ExplodeDirective} from './explode/explode.directive';
import {R32020Module} from './r32020/r32020.module';
import {HeroHireModule} from './hero-hire/hero-hire.module';
import {BusyComponent} from './common/busy/busy/busy.component';
import {IndicatorsModule} from '@progress/kendo-angular-indicators';
import {NotificationModule, NOTIFICATION_CONTAINER} from '@progress/kendo-angular-notification';
import {ToastComponent} from './toast/toast.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { PonyGridComponent } from './pony-grid/pony-grid.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {dataEncapsulation: false}),
    InputsModule,
    BrowserAnimationsModule,
    LabelModule,
    ButtonsModule,
    LayoutModule,
    DropDownsModule,
    R32020Module,
    HeroHireModule,
    IndicatorsModule,
    NotificationModule,
    GridModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeroSearchComponent,
    BusyComponent,
    ToastComponent,
    ExplodeDirective,
    PonyGridComponent,
  ],
  providers: [
    {
      provide: NOTIFICATION_CONTAINER,
      useFactory: () => {
        //return the container ElementRef, where the notification will be injected
        return {nativeElement: document.body} as ElementRef;
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BusyHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
