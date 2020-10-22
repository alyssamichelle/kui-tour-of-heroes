import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Pony, ponies } from '../../r32020/list-view/ponies';
import { HireRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HeroHireService {

  /**
   * Get an initial list of all heroes
   */
  public getAvailableHeroes(): Observable<Pony[]> {
    return of([...ponies]);
  }

  /**
   * Get a filtered list of available heroes
   * @param kinds {string[]} Optional array of hero kinds to filter by
   */
  public getFilteredHeroes(kinds?: string[]): Observable<Pony[]> {
    return of([...ponies]).pipe(
      map((heroes: Pony[]) => {
        if (kinds && kinds.length > 0) {
          return heroes.filter((hero: Pony) => {
            return hero.kind.filter((heroKind: string) => kinds.includes(heroKind)).length > 0;
          });
        } else {
          return heroes;
        }
      })
    );
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

  /**
   * Send the hire request to the server
   * @param hireRequest {HireRequest} The Hire Request object containing booking details
   */
  public hireMyHero(hireRequest: HireRequest): Observable<string> {
    return of('Booking Successful');
  }
}
