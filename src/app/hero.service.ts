import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, debounceTime, distinctUntilChanged, map, scan, shareReplay, switchMap, tap } from 'rxjs/operators';

import { Action, Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // DJK1 Declarative approach
  // With shareReplay(1) to retain the data across pages
  // And added sort
  /** GET heroes from the server */
  allHeroes$ = this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      map(heroes => heroes.sort(this.compare)),
      shareReplay(1),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );

    
  // DJK3 Action stream: Handle create, update, delete
  private heroCUDSubject = new Subject<Action<Hero>>();
  heroCUDAction$ = this.heroCUDSubject.asObservable();

  // Emit the results from all CRUD operations
  // from one stream
  heroes$ = merge(
    this.allHeroes$,
    this.heroCUDAction$.pipe(
      // Save the operation to the backend
      concatMap(actionHero => this.saveHero(actionHero))
    )
  ).pipe(
    // Modify the retained array of heroes
    scan((heroes: Hero[], heroAction: Action<Hero>) => this.modifyHeroArray(heroes, heroAction)),
    shareReplay(1)
  );

  // DJK2 Action stream: Select hero
  private heroSelectedSubject = new BehaviorSubject<number>(0);
  // Expose the action as an observable for use by any components
  heroSelectedAction$ = this.heroSelectedSubject.asObservable();

  // DJK2 Get single hero Option 1: Data stream + Action stream
  // Locating the hero in the already retrieved list of heroes
  hero$ = combineLatest([
    this.heroes$,
    this.heroSelectedAction$
  ]).pipe(
    map(([heroes, selectedHeroId]) =>
      heroes.find(hero => hero.id === selectedHeroId)
    )
  );

  // DJK2 Get single hero Option 2: Retrieve from server
  hero2$ = this.heroSelectedAction$.pipe(
    switchMap(id => {
      const url = `${this.heroesUrl}/${id}`;
      return this.http.get<Hero>(url).pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
    })
  );

  // DJK Action stream: Filter to match search criteria
  private searchTermsSubject = new BehaviorSubject<string>('');
  searchTermsAction$ = this.searchTermsSubject.asObservable();

  // DJK Option 1: Filtering the already retrieved list of heroes
  filteredHeroes$ = combineLatest([
    this.heroes$,
    this.searchTermsAction$.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged()
    )
  ]).pipe(
    tap(([heroes, term]) => this.log(`term "${term}"`)),
    map(([heroes, term]) =>
      heroes.filter(hero => hero.name.toLowerCase().includes(term.toLowerCase())))
  );

  // DJK Option 2: Filtering on the server
  filteredHeroes2$ = this.searchTermsAction$.pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),
    // ignore new term if same as previous term
    distinctUntilChanged(),
    switchMap(term => {
      if (!term.trim()) {
        // if no search term, return empty hero array.
        return of([]);
      }
      return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(_ => this.log(`found heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
    })
  );

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  //////// Action methods //////////

  selectHero(id: number): void {
    this.heroSelectedSubject.next(id);
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  addHero(hero: Hero): void {
    this.heroCUDSubject.next({ action: 'add', hero });
  }

  deleteHero(hero: Hero): void {
    this.heroCUDSubject.next({ action: 'delete', hero });
  }

  updateHero(hero: Hero): void {
    this.heroCUDSubject.next({ action: 'update', hero });
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  private addHeroOnServer(heroAction: Action<Hero>): Observable<Action<Hero>> {
    return this.http.post<Hero>(this.heroesUrl, heroAction.hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero')),
      // Return the hero action so that it can be used in the scan.
      map(hero => ({ action: heroAction.action, hero }))
    );
  }

  /** DELETE: delete the hero from the server */
  private deleteHeroOnServer(heroAction: Action<Hero>): Observable<Action<Hero>> {
    const id = heroAction.hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      // Delete does NOT return the hero
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero')),
      // Return the hero action so that it can be used in the scan.
      map(_ => ({ action: heroAction.action, hero: heroAction.hero }))
    );
  }

  /** PUT: update the hero on the server */
  private updateHeroOnServer(heroAction: Action<Hero>): Observable<Action<Hero>> {
    const id = heroAction.hero.id;

    return this.http.put(this.heroesUrl, heroAction.hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${id}`)),
      catchError(this.handleError<Hero>('updateHero')),
      // Return the hero action so that it can be used in the scan.
      map(_ => ({ action: heroAction.action, hero: heroAction.hero }))
    );
  }

  // Execute the appropriate operation based on the action
  private saveHero(heroAction: Action<Hero>): Observable<Action<Hero>> {
    if (heroAction.action === `add`) {
      return this.addHeroOnServer(heroAction);
    } else if (heroAction.action === `update`) {
      return this.updateHeroOnServer(heroAction);
    } else if (heroAction.action === 'delete') {
      return this.deleteHeroOnServer(heroAction);
    }
    return of(heroAction);
  }

  // Add to, update in, or delete item from the array
  // Re-sort as needed
  private modifyHeroArray(heroes: Hero[], heroAction: Action<Hero>): Hero[] {
    if (heroAction.action === `add`) {
      // Add the hero to the array of heroes
      return [...heroes, heroAction.hero].sort(this.compare);
    } else if (heroAction.action === `update`) {
      // Update the hero in the array of heroes
      return heroes.map(h => h.id === heroAction.hero.id ? heroAction.hero : h).sort(this.compare);
    } else if (heroAction.action === 'delete') {
      // Filter out the hero from the array of heroes
      return heroes.filter(h => h.id !== heroAction.hero.id);
    }
    return heroes;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  /** Define how the heroes are compared for the sort */
  private compare(a: Hero, b: Hero): 1 | -1 {
    // Use toUpperCase() to ignore character casing
    return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1;
  }

}
