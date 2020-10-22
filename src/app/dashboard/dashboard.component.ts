import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { HeroService } from '../hero.service';

// With async pipe, can change to OnPush change detection.
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

  // DJK1 Declarative approach
  heroes$ = this.heroService.heroes$.pipe(
    // Randomly pick the "top" heroes
    map(heroes => [...heroes].sort(() => Math.random() - Math.random()).slice(0, 4))
  );

  constructor(private heroService: HeroService) { }
}
