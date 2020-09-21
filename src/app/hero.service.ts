import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // DJK1: Heroes
  heroes$ = this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes - declarative')),
      map(heroes => heroes.sort(this.compare)),
      shareReplay(1),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );

  // DJK2: Hero
  private heroSelectedSubject = new BehaviorSubject<number>(0);
  // Expose the action as an observable for use by any components
  heroSelectedAction$ = this.heroSelectedSubject.asObservable();

  hero$ = this.heroSelectedAction$.pipe(
    switchMap(id => {
      const url = `${this.heroesUrl}/${id}`;
      return this.http.get<Hero>(url).pipe(
        tap(_ => this.log(`fetched hero - declarative id =${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      )
    })
  );

  // DJK3: Search
  private heroSearchSubject = new Subject<string>();
  // Expose the action as an observable for use by any components
  heroSearchAction$ = this.heroSearchSubject.asObservable().pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),

    // ignore new term if same as previous term
    distinctUntilChanged(),
  );

  // DJK3: Search
  filteredHeroes$ = combineLatest([
    this.heroes$,
    this.heroSearchAction$]).pipe(
      tap(([heroes, term]) => this.log(`term: ${term}`)),
      map(([heroes, term]) =>
        heroes.filter(hero => hero.name.toLowerCase().includes(term.toLowerCase()))),
      tap(x => x.length ?
        this.log(`found matching heroes`) :
        this.log(`no matching heroes found`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  // DJK2: Hero
  changeHero(id: number) {
    // Emit the selected hero into the stream
    this.heroSelectedSubject.next(id);
  }

  // DJK1: Heroes
  compare(a: Hero, b:Hero) {
    // Use toUpperCase() to ignore character casing
    const heroA = a.name.toUpperCase();
    const heroB = b.name.toUpperCase();
  
    let comparison = 0;
    if (heroA > heroB) {
      comparison = 1;
    } else if (heroA < heroB) {
      comparison = -1;
    }
    return comparison;
  }

  // DJK3: Search
  searchHeroes(term: string) {
    this.heroSearchSubject.next(term);
  }

  /** GET heroes from the server */
  // getHeroes(): Observable<Hero[]> {
  //   return this.http.get<Hero[]>(this.heroesUrl)
  //     .pipe(
  //       tap(_ => this.log('fetched heroes')),
  //       catchError(this.handleError<Hero[]>('getHeroes', []))
  //     );
  // }

  // /** GET hero by id. Return `undefined` when id not found */
  // getHeroNo404<Data>(id: number): Observable<Hero> {
  //   const url = `${this.heroesUrl}/?id=${id}`;
  //   return this.http.get<Hero[]>(url)
  //     .pipe(
  //       map(heroes => heroes[0]), // returns a {0|1} element array
  //       tap(h => {
  //         const outcome = h ? `fetched` : `did not find`;
  //         this.log(`${outcome} hero id=${id}`);
  //       }),
  //       catchError(this.handleError<Hero>(`getHero id=${id}`))
  //     );
  // }

  // /** GET hero by id. Will 404 if id not found */
  // getHero(id: number): Observable<Hero> {
  //   const url = `${this.heroesUrl}/${id}`;
  //   return this.http.get<Hero>(url).pipe(
  //     tap(_ => this.log(`fetched hero id=${id}`)),
  //     catchError(this.handleError<Hero>(`getHero id=${id}`))
  //   );
  // }

  // /* GET heroes whose name contains search term */
  // searchHeroes(term: string): Observable<Hero[]> {
  //   if (!term.trim()) {
  //     // if not search term, return all heroes.
  //     return this.heroes$;
  //   }
  //   return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
  //     tap(x => x.length ?
  //       this.log(`found heroes matching "${term}"`) :
  //       this.log(`no heroes matching "${term}"`)),
  //     catchError(this.handleError<Hero[]>('searchHeroes', []))
  //   );
  // }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
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
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
