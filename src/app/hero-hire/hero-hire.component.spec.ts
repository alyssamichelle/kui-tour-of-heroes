import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroHireComponent } from './hero-hire.component';

describe('HeroHireComponent', () => {
  let component: HeroHireComponent;
  let fixture: ComponentFixture<HeroHireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroHireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroHireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
