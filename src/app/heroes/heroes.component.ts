import { Component } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent {
  avatarLink='';

  // DJK1 Declarative approach
  heroes$ = this.heroService.heroes$;

  constructor(private heroService: HeroService) { }

  // DJK3 Add a new hero
  name='';
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero);
  }

  // DJK3 Delete the selected hero
  delete(hero: Hero): void {
    this.heroService.deleteHero(hero);
  }

  getAvatarLink(heroId: number): string {
    let avatarLink = '../assets/mlp-avatars/pony-' + heroId + '.png';

    if (heroId > 53) {
      avatarLink = '../assets/mlp-avatars/pony-11.png';
    }
    return avatarLink;
  }

}
