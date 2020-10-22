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
  styles: [
    `
      /* HeroesComponent's private CSS styles */

      /* Variables that need to be moved to global var file */

      $pony-pink: #f03c97;
      /* $grass-green: #6ea965; */

      .heroes {
        list-style-type: none;
        padding: 0;
        margin: 0 6% 2em 0;
        display: flex;
        flex-wrap: wrap;
      }

      .heroes li {
        cursor: pointer;
        background-color: #eee;
        margin: 0.5em;
        height: 3rem;
        width: 17em;
        border-radius: 4px;

        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .heroes li:hover {
        color: #607d8b;
        background-color: #ddd;
        left: 0.1em;
      }

      .heroes a {
        color: #333;
        text-decoration: none;

        display: flex;
        width: 100%;
        height: 100%;
      }

      .heroes .hero-name {
        font-size: 2rem;
        line-height: 3.2rem;

        color: #8c2167;
        /* -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #8c2167; */
        font-family: pony, cursive;
        padding: 0 2px;

        /* so really long names don't wrap */
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 11rem;
      }

      .heroes a:hover {
        color: #607d8b;
      }

      .heroes .avatar {
        display: inline-block;
        margin-right: 10px;
        color: white;
        padding: 0.5em;
        background-color: $pony-pink;
        height: 100%;
        border-radius: 4px 0 0 4px;
        max-width: 60px;
        overflow: hidden;
      }

      button {
        background-color: #eee;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        cursor: hand;
        font-family: Arial;
      }

      button:hover {
        background-color: #cfd8dc;
      }

      button.delete {
        margin-right: 5px;
        line-height: 0;
      }

      @media all and (max-width: 699px) {
        .heroes li {
          margin: 1.2em;
          width: 100vw;
        }
        .heroes .hero-name {
          max-width: 21rem;
        }
      }

      .new-hero-form {
        display: flex;
        align-items: center;
        margin: 0.5em;
        margin-bottom: 40px;
        position: relative;
      }
      .new-hero-form kendo-label {
        position: absolute;
        top: -22px;
      }

      .new-hero-form input {
        margin-bottom: 4px;
      }

      .new-hero-form button {
        margin-left: 20px;
      }
    `,
  ],
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
