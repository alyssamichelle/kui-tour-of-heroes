import { Component } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent {

  // DJK Declarative approach
  heroes$ = this.heroService.filteredHeroes$;

  constructor(private heroService: HeroService, private router: Router) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.heroService.search(term);
  }

  // on dropdownlist value change, navigate to that hero's detail page
  public onValueChange(hero: Hero): void {
    if (hero.id) {
      this.router.navigate(['/detail/' + hero.id]);
    }
  }
}
