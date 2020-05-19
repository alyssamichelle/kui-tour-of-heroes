import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 11, name: 'Twighlight Sparkle' },
      { id: 12, name: 'Pinkie Pie' },
      { id: 13, name: 'Gummy' },
      { id: 14, name: 'Fluttershy' },
      { id: 15, name: 'Rainbow Dash' },
      { id: 16, name: 'Rarity' },
      { id: 17, name: 'Princess Celestia' },
      { id: 18, name: 'Applejack' },
      { id: 19, name: 'Princess Luna' },
      { id: 20, name: 'Spike' },

      { id: 21, name: 'Scootaloo' },
      { id: 22, name: 'Discord' },
      { id: 23, name: 'Sweetie Belle' },
      { id: 24, name: 'Shinning Armor' },
      { id: 25, name: 'Trixie' },
      { id: 26, name: 'Derpy Hooves' },
      { id: 27, name: 'Big McIntosh' },
      { id: 28, name: 'Snips' },
      { id: 29, name: 'Diamond Tiara' },
      { id: 30, name: 'Granny Smith' },
      { id: 31, name: 'Apple Bloom' },
      { id: 32, name: 'Babs Seed' },
      { id: 33, name: 'Goldie Delicious' },
      { id: 34, name: 'Maud Pie' },
      { id: 35, name: 'Filthy Rich' },
      { id: 36, name: 'Silver Spoon' },
      { id: 37, name: 'Pipsqueak' },
      { id: 38, name: 'Nightmare Moon' },
      { id: 39, name: 'King Sombra' },
      { id: 40, name: 'Gilda' },
      { id: 41, name: 'Daring Do' },
      { id: 42, name: 'Spitfire' },
      { id: 43, name: 'Star Swirl the Bearded' },
      { id: 44, name: 'Boneless' },
      { id: 45, name: 'Zecora' },
      { id: 46, name: 'Cranky Doodle Donkey' },
      { id: 47, name: 'Gilda' },
      { id: 48, name: 'Tank' },
      { id: 49, name: 'Angel' },
      { id: 50, name: 'Owlowiscious' },
      { id: 51, name: 'Opalescence' },
      { id: 52, name: 'Winona' }
    ];
    return {heroes};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}
