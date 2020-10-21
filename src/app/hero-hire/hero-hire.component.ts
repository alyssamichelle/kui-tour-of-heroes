import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { HeroHireService } from './services';

import { Pony } from '../r32020/list-view/ponies';

@Component({
  selector: 'app-hero-hire',
  templateUrl: './hero-hire.component.html',
  styleUrls: ['./hero-hire.component.css']
})
export class HeroHireComponent implements OnInit {

  public heroFilterForm: FormGroup;

  public availableHeroes$: Observable<Pony[]>;
  public heroKinds$: Observable<string[]>;

  constructor(private formBuilder: FormBuilder, private heroHireService: HeroHireService) { }

  ngOnInit(): void {
    this.initialiseForm();
    this.addSubscriptions();
  }

  /**
   * Initialise the heroFilterForm. You could do this in ngOnInit, but I like to keep that lifecycle hook as clean as possible
   */
  private initialiseForm(): void {
    this.heroFilterForm = this.formBuilder.group({
      hero: [null, Validators.required],
      kind: [null],
      bookingName: [null, Validators.required],
      bookingEmail: [null, Validators.compose([Validators.required, Validators.email])],
      bookingPhone: [null],
      gdpr: [false, Validators.required]
    });
  }

  /**
   * Add the subscriptions we will use in the form
   */
  private addSubscriptions(): void {
    this.availableHeroes$ = this.heroHireService.getAvailableHeroes();
    this.heroKinds$ = this.heroHireService.getUniqueKinds();
  }

  /**
   * Handle change events on the hero kind dropdown
   * @param kinds {string[]} The array of hero kinds emitted by the component
   */
  public heroKindChanged(kinds: string[]): void {
    this.availableHeroes$ = this.heroHireService.getFilteredHeroes(kinds);

    if (kinds.length > 0) {
      // If the currently selected hero does not fit the new filter, we reset the value
      const heroControl: AbstractControl = this.heroFilterForm.get('hero');
      const selectedHero: Pony = heroControl.value;
  
      if (selectedHero !== null && selectedHero.kind.filter((kind: string) => kinds.includes(kind)).length === 0) {
        heroControl.reset();
      }
    }
  }

  /**
   * Check if the form is valid and submit
   */
  public onSubmit(): void {
    console.log('submit');
    console.log(this.heroFilterForm.valid);
    console.log(this.heroFilterForm.value);
  }

  /**
   * Reset the form
   */
  public onResetForm(): void {
    this.heroFilterForm.reset();
    this.availableHeroes$ = this.heroHireService.getAvailableHeroes();
  }

}
