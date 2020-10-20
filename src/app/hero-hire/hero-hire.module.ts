import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroHireComponent } from './hero-hire.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
  declarations: [HeroHireComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    LayoutModule,
    DropDownsModule,

  ]
})
export class HeroHireModule { }
