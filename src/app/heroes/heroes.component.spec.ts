import { HeroesComponent } from './heroes.component';

import { TestBed } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

describe('HeroesComponent', () => {
  let componentUnderTest: HeroesComponent;
  let heroServiceSpy: Spy<HeroService>;

  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroesComponent,
        {provide: HeroService, useValue: createSpyFromClass(HeroService)}
      ]
    });

    componentUnderTest = TestBed.inject(HeroesComponent);
    heroServiceSpy = TestBed.inject<any>(HeroService);

    actualResult = undefined;

  });

  describe('METHOD: getHeroes', () => {

    let fakeHeroes: Hero[];

    Given(() => {
      fakeHeroes = [
        {
          id: 11111111,
          name: 'Bonnie'
        }
      ];

      heroServiceSpy.getHeroes.and.nextWith(fakeHeroes);
    });

    When(() => {
      componentUnderTest.getHeroes();
    });

    Then('saving the heroes locally', () => {
      expect(componentUnderTest.heroes).toEqual(fakeHeroes);
    });
    
    

  });
});
