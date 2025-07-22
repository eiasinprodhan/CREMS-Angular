import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewcustomers } from './viewcustomers';

describe('Viewcustomers', () => {
  let component: Viewcustomers;
  let fixture: ComponentFixture<Viewcustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewcustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewcustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
