import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ponies } from '../ponies';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

import { PagerSettings } from '@progress/kendo-angular-listview';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListViewComponent implements OnInit {
  heroes: Hero[];
  avatarLink: string;
  public ponies: any[] = ponies;

  public pagerSettings: PagerSettings = {
    position: "bottom",
    previousNext: false,
    type: "numeric"
  };
  public pageSize = 5;
  loader:boolean = true;

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
  // redo getHeros to know when loading is fin

  getAvatarLink(heroId): string {
    let avatarLink = '../assets/mlp-avatars/pony-' + heroId + '.png';

    if (heroId > 53) {
      avatarLink = '../assets/mlp-avatars/pony-11.png';
    }

    return avatarLink;
  }

  // FILTERING with search TextBox on ListView
  // public handleFilterChange(query: string): void {
  //   const normalizedQuery = query.toLowerCase();
  //   const filterExpession = item =>
  //     item.name.toLowerCase().indexOf(normalizedQuery) !== -1 ||
  //     (item.alias != null &&
  //       item.alias?.toLowerCase().indexOf(normalizedQuery) !== -1);

  //   this.ponies = ponies.filter(filterExpession);
  // }
}
