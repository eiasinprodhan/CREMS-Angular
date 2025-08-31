import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listbooking } from './listbooking';

describe('Listbooking', () => {
  let component: Listbooking;
  let fixture: ComponentFixture<Listbooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listbooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listbooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
