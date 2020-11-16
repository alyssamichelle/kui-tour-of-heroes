import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewComponent } from './list-view.component'; 
import { ListViewModule } from '@progress/kendo-angular-listview';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { IconsModule } from '@progress/kendo-angular-icons';

@NgModule({
  declarations: [ListViewComponent],
  imports: [
    CommonModule,
    RouterModule,
    ButtonsModule,
    FormsModule,
    InputsModule,
    IndicatorsModule,
    IconsModule,
    ListViewModule
  ],
  exports: [
    ListViewComponent
  ]
})
export class LVM { }
