import { HeroesComponent } from './heroes.component';

import { TestBed } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { HeroService } from '../hero.service';

describe('HeroesComponent', () => {
  let componentUnderTest: HeroesComponent;

  let actualResult: any;

  Given(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroesComponent,
        { provide: HeroService }
      ]
    });

    componentUnderTest = TestBed.inject(HeroesComponent);

    actualResult = undefined;

  });

  describe('METHOD: add', () => {
    
    let fakeName: string;

    describe('GIVEN a name', () => {
      Given(() => {
        // a name
        fakeName = 'Bonnie ';


      });

      When(() => {
        componentUnderTest.add(fakeName);
      });

      Then('add the trimmed name remotely and locally', () => {
        const trimmedName = 'Bonnie';
        const expectedHero = {
          name: trimmedName
        }

        // add the trimmed name remotely and locally
      });
    });

  });
});
