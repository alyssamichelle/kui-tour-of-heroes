import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatAll, concatMap, distinct, map } from 'rxjs/operators';

import { Pony, ponies } from '../r32020/list-view/ponies';

@Injectable({
  providedIn: 'root'
})
export class HeroHireService {

  /**
   * Get a filtered list of the available heroes
   */
  public getAvailableHeroes(): Observable<Pony[]> {
    return of([...ponies]);
  }

  /**
   * Get the unique pony kinds for our filter. In reality you probably wouldn't want to do it this way, or you'd have another API to call
   * but this is a nice way to keep it consistent with the data we have available
   */
  public getUniqueKinds(): Observable<string[]> {
    return this.getAvailableHeroes().pipe(
      map((heroes: Pony[]) => {
        // Just whip out the kinds[] from each pony
        return heroes.map((hero: Pony) => hero.kind);
      }),
      map((kinds: string[][]) => {
        // Flatten the array of arrays
        return kinds.reduce((flatArray, currentItem) => flatArray.concat(currentItem))
      }),
      map((kinds: string[]) => {
        // Pull out the unique kinds
        const uniqueKinds: string[] = [];

        kinds.forEach((kind: string) => {
          if (!uniqueKinds.includes(kind)) {
            uniqueKinds.push(kind);
          }
        });

        return uniqueKinds.sort();
      })
    );
  }

}
