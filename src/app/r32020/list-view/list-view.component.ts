import { Component } from '@angular/core';

import { HeroService } from '../../hero.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
  avatarLink='';

  // DJK Declarative approach
  heroes$ = this.heroService.heroes$;

  constructor(private heroService: HeroService) { }

  getAvatarLink(heroId: number): string {
    let avatarLink = '../assets/mlp-avatars/pony-' + heroId + '.png';

    if (heroId > 53) {
      avatarLink = '../assets/mlp-avatars/pony-11.png';
    }

    return avatarLink;
  }
}
