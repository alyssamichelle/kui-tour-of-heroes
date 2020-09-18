import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // heroes: Hero[] = [];

  // DJK1: Heroes
  heroes$ = this.heroService.heroes$.pipe(
    map(heroes => heroes.slice(1, 5))
  );

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    // this.getHeroes();
  }

  // getHeroes(): void {
    //   this.heroService.getHeroes()
    //     .subscribe(heroes => this.heroes = heroes.slice(1, 5));
    // }
  }
