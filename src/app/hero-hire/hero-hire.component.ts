import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HeroHireService } from './hero-hire.service';
import { Pony } from '../r32020/list-view/ponies';
import { Observable } from 'rxjs';

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

    this.heroHireService.getAvailableHeroes().subscribe(
      (heroes: Pony[]) => {
        console.log(heroes);
      }
    );

    this.heroHireService.getUniqueKinds().subscribe(
      (kinds: string[]) => console.log(kinds)
    );
  }

  /**
   * Initialise the heroFilterForm. You could do this in ngOnInit, but I like to keep that lifecycle hook as clean as possible
   */
  private initialiseForm(): void {
    this.heroFilterForm = this.formBuilder.group({
      heroName: [null, Validators.required],
      gender: [null],
      kind: [null]
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
  }

}
