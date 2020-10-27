import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { HeroHireService } from './services';

import { Pony } from '../r32020/list-view/ponies';
import { numberOnly, phoneUS, phoneUK } from './helpers';
import { HireRequest } from './models';
import { Location } from './enums';

@Component({
  selector: 'app-hero-hire',
  templateUrl: './hero-hire.component.html',
  styleUrls: ['./hero-hire.component.css']
})
export class HeroHireComponent implements OnInit {

  public heroBookingForm: FormGroup;
  public submitted: boolean;

  public today: string;
  public location: Location;
  public locationEnum = Location;

  public availableHeroes$: Observable<Pony[]>;
  public heroKinds$: Observable<string[]>;

  constructor(private formBuilder: FormBuilder, private heroHireService: HeroHireService) { }

  ngOnInit(): void {
    this.today = this.getToday();
    this.location = Location.UK;
    this.initialiseForm();
    this.addSubscriptions();
  }

  /**
   * Initialise the heroFilterForm. You could do this in ngOnInit, but I like to keep that lifecycle hook as clean as possible
   */
  private initialiseForm(): void {
    this.heroBookingForm = this.formBuilder.group({
      hero: [null, Validators.required],
      kind: [null],
      name: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      phone: [null, Validators.pattern(numberOnly)],
      date: [null, Validators.required],
      gdpr: [false]
    });

    this.setConditonalValidators();
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
      const heroControl: AbstractControl = this.heroBookingForm.get('hero');
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
    // Mark the form as submitted to display the error fields
    this.submitted = true;

    if (this.heroBookingForm.valid) {
      const { hero, name, email, phone, date, gdpr } = this.heroBookingForm.value;
      const hireRequest: HireRequest = { hero: hero.id, name, email, phone, date, gdpr };

      this.heroHireService.hireMyHero(hireRequest).subscribe(
        (res) => {
          alert(res);
          this.onResetForm();
        },
        (err) => console.error(err)
      );
    }
  }

  /**
   * Reset the form
   */
  public onResetForm(): void {
    // Mark the form as unsubmitted, otherwise the form validation may trigger
    this.submitted = false;
    // Reset all form fields
    this.heroBookingForm.reset();
    // Reset the heroes dropdown to the original list
    this.availableHeroes$ = this.heroHireService.getAvailableHeroes();
  }

  /**
   * Helper method for use on the template for fetching a form control with less code
   */
  public get formControl(): {[key: string]: AbstractControl} {
    return this.heroBookingForm.controls;
  }

  /**
   * Add some conditional validators to the form based on location
   */
  private setConditonalValidators(): void {
    // UK and Europe need the GDPR field
    if (this.location === Location.EUROPE || this.location === Location.UK) {
      this.heroBookingForm.get('gdpr').setValidators(Validators.requiredTrue);
    }

    // UK needs the UK phone number validator
    if (this.location === Location.UK) {
      this.heroBookingForm.get('phone').setValidators(Validators.pattern(phoneUK));
    }

    // USA needs the US phone number validator
    if (this.location === Location.USA) {
      this.heroBookingForm.get('phone').setValidators(Validators.pattern(phoneUS));
    }

    // So sorry anyone in any other country - there are too many variations and my RegEx skills are not on that scale!
  }

  /**
   * Get today's date in string format accepted by the date picker
   */
  private getToday(): string {
    const today = new Date();
    const day: number = today.getDate();
    const month: number = today.getMonth() + 1;
    const year: number = today.getFullYear();

    return `${year}-${this.appendZeroes(month)}-${this.appendZeroes(day)}`;
  }

  /**
   * Append a zero to months and days less than 10
   * @param val {number} The value to check
   */
  private appendZeroes(val: number): string {
    return val < 10 ? `0${val}`: `${val}`;
  }
}
