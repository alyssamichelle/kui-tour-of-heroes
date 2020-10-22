import { Component, OnInit } from '@angular/core';
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

  // DJK2 Declarative approach
  hero$ = this.heroService.hero$;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    // Get the selected hero id from the route
    // Call the service to emit that id
    // find or retrieve the associated hero
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.selectHero(id);
  }

  goBack(): void {
    this.location.back();
  }

  // DJK3 Save an updated hero
  save(hero: Hero): void {
    this.heroService.updateHero(hero);
    // Instead of going back immediately
    // Could define a "saveComplete" Action stream in the service,
    // subscribe to it, and goBack when "saveComplete" emits.
    this.goBack();
  }
}
