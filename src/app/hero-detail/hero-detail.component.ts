import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  template: `
    <div *ngIf="hero">
      <h2 [attr.data-text]="hero.name + ' Details'">{{ hero.name }} Details</h2>

      <div><span>id: </span>{{ hero.id }}</div>
      <div>
        <label
          >name:
          <input [(ngModel)]="hero.name" placeholder="name" />
        </label>
      </div>
      <button (click)="goBack()">go back</button>
      <button (click)="save()">save</button>
    </div>
  `,
  styleUrls: ['./hero-detail.component.scss'],
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  constructor(private route: ActivatedRoute, private heroService: HeroService, private location: Location) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
  }
}
