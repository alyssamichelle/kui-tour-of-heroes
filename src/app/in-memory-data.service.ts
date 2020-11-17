import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes =
      [
        { id: 11, name: 'Twighlight Sparkle', age: 27 },
        { id: 12, name: 'Pinkie Pie', age: 15 },
        { id: 13, name: 'Gummy', age: 7 },
        { id: 14, name: 'Fluttershy', age: 37 },
        { id: 15, name: 'Rainbow Dash', age: 12 },
        { id: 16, name: 'Rarity', age: 16 },
        { id: 17, name: 'Princess Celestia', age: 10 },
        { id: 18, name: 'Applejack', age: 44 },
        { id: 19, name: 'Princess Luna', age: 47 },
        { id: 20, name: 'Spike', age: 41 },
        { id: 21, name: 'Scootaloo', age: 38 },
        { id: 22, name: 'Discord', age: 18 },
        { id: 23, name: 'Sweetie Belle', age: 3 },
        { id: 24, name: 'Shinning Armor', age: 29 },
        { id: 25, name: 'Trixie', age: 26 },
        { id: 26, name: 'Derpy Hooves', age: 42 },
        { id: 27, name: 'Big McIntosh', age: 43 },
        { id: 28, name: 'Snips', age: 5 },
        { id: 29, name: 'Diamond Tiara', age: 32 },
        { id: 30, name: 'Granny Smith', age: 13 },
        { id: 31, name: 'Apple Bloom', age: 17 },
        { id: 32, name: 'Babs Seed', age: 9 },
        { id: 33, name: 'Goldie Delicious', age: 35 },
        { id: 34, name: 'Maud Pie', age: 28 },
        { id: 35, name: 'Filthy Rich', age: 33 },
        { id: 36, name: 'Silver Spoon', age: 23 },
        { id: 37, name: 'Pipsqueak', age: 40 },
        { id: 38, name: 'Nightmare Moon', age: 31 },
        { id: 39, name: 'King Sombra', age: 14 },
        { id: 40, name: 'Gilda', age: 45 },
        { id: 41, name: 'Daring Do', age: 4 },
        { id: 42, name: 'Spitfire', age: 39 },
        { id: 43, name: 'Star Swirl the Bearded', age: 6 },
        { id: 44, name: 'Boneless', age: 46 },
        { id: 45, name: 'Zecora', age: 1 },
        { id: 46, name: 'Cranky Doodle Donkey', age: 20 },
        { id: 47, name: 'Gilda', age: 30 },
        { id: 48, name: 'Tank', age: 48 },
        { id: 49, name: 'Angel', age: 36 },
        { id: 50, name: 'Owlowiscious', age: 21 },
        { id: 51, name: 'Opalescence', age: 25 },
        { id: 52, name: 'Winona', age: 8 },
        { id: 60, name: 'Fancy Fritz', age: 11 },
        { id: 61, name: 'Sassy Sara', age: 19 },
        { id: 62, name: 'Angular Alyssssa', age: 49 }
      ];
    return { heroes };
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
