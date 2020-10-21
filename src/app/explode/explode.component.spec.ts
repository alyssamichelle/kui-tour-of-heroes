import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplodeDirective } from './explode.component';

describe('ExplodeComponent', () => {
  let component: ExplodeDirective;
  let fixture: ComponentFixture<ExplodeDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplodeDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplodeDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
