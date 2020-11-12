import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeroHireComponent } from './hero-hire.component';

describe('HeroHireComponent', () => {
  let component: HeroHireComponent;
  let fixture: ComponentFixture<HeroHireComponent>;

  beforeEach(waitForAsync(() => {
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
