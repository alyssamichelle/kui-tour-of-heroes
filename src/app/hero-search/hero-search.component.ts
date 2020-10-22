import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-search',
  template: ` <div class="search-component">
    <h3>Hop to a specific Hero:</h3>
    <kendo-dropdownlist
      (open)="setInitialValue('')"
      [data]="heroes$ | async"
      [filterable]="true"
      [textField]="'name'"
      [valueField]="id"
      (filterChange)="search($event)"
      (valueChange)="onValueChange($event)"
    >
    </kendo-dropdownlist>
    <!-- TODO: figure out why this is jank vv -->
    <!-- [defaultItem]="'Find your Hero ...'" -->
  </div>`,
  styleUrls: ['./hero-search.component.scss'],
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService, private router: Router) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  public setInitialValue(): void {
    this.search('');
  }

  // on dropdownlist value change, navigate to that hero's detail page
  public onValueChange(hero: Hero): void {
    if (hero.id) {
      this.router.navigate(['/detail/' + hero.id]);
    }
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
