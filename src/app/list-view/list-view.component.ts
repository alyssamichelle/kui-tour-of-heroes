import { Component, OnInit } from '@angular/core';
import { ponies } from '../ponies';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {
  heroes: Hero[];
  avatarLink: string;
  public ponies: any[] = ponies;


  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => {
        this.heroes = heroes;
      });
  }

  getAvatarLink(heroId): string {
    let avatarLink = '../assets/mlp-avatars/pony-' + heroId + '.png';

    if (heroId > 53) {
      avatarLink = '../assets/mlp-avatars/pony-11.png';
    }

    return avatarLink;
  }
}
