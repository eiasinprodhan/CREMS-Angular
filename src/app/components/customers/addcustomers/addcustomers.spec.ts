import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addcustomers } from './addcustomers';

describe('Addcustomers', () => {
  let component: Addcustomers;
  let fixture: ComponentFixture<Addcustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addcustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addcustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
