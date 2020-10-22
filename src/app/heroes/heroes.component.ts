import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  template: ` <h2 data-text="The Heroes">The Heroes</h2>

    <kendo-formfield class="new-hero-form form-group">
      <kendo-label [for]="heroName">Hero Name</kendo-label>
      <input kendoTextBox id="heroName" #heroName [(ngModel)]="name" required />

      <kendo-formhint>The name of our new hero!</kendo-formhint>
      <kendo-formerror>A name is required to create a new hero.</kendo-formerror>

      <!-- (click) passes input value to add() and then clears the input -->

      <button kendoButton (click)="add(heroName.value); heroName.value = ''">Add</button>
    </kendo-formfield>

    <app-list-view></app-list-view>

    <ul class="heroes">
      <li *ngFor="let hero of heroes">
        <a routerLink="/detail/{{ hero.id }}">
          <img class="avatar" [src]="getAvatarLink(hero.id)" title="pony avatar img" />
          <div class="hero-name">{{ hero.name }}</div>
        </a>
        <button kendoButton [icon]="'close'" class="delete" title="delete hero" (click)="delete(hero)"></button>
      </li>
    </ul>`,
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  avatarLink: string;

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
    });
  }

  name: string;
  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.addHero({ name } as Hero).subscribe((hero) => {
      this.heroes.push(hero);
    });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter((h) => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

  getAvatarLink(heroId): string {
    let avatarLink = '../assets/mlp-avatars/pony-' + heroId + '.png';

    if (heroId > 53) {
      avatarLink = '../assets/mlp-avatars/pony-11.png';
    }

    return avatarLink;
  }
}
