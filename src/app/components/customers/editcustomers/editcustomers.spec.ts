import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editcustomers } from './editcustomers';

describe('Editcustomers', () => {
  let component: Editcustomers;
  let fixture: ComponentFixture<Editcustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editcustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editcustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
