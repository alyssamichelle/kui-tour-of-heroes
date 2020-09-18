import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  // @Input() hero: Hero;

  // DJK2: Hero
  hero$ = this.heroService.hero$;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  // DJK2: Hero
  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.changeHero(id);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    // this.heroService.updateHero(this.hero)
    //   .subscribe(() => this.goBack());
  }
}
