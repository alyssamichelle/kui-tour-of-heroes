import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(router: Router) {
    const navEndEvents = router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    );
    navEndEvents.subscribe((e: NavigationEnd) => {
      gtag('config', 'UA-66278430-7', {'page_path':e.urlAfterRedirects});
    })
  }
}
