import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewbooking } from './viewbooking';

describe('Viewbooking', () => {
  let component: Viewbooking;
  let fixture: ComponentFixture<Viewbooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewbooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewbooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
