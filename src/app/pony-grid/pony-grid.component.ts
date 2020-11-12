import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ponies } from '../ponies';

// import { HeroHireService } from './services';
// TODO: figure out a way to make this service reusable and/or get an observable of ponies, yo

@Component({
  selector: 'app-pony-grid',
  templateUrl: './pony-grid.component.html',
  styleUrls: ['./pony-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PonyGridComponent implements OnInit {

  public ponies: any[] = ponies;
  constructor() { }

  ngOnInit(): void {
  }

}
