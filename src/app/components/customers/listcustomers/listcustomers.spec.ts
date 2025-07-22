import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listcustomers } from './listcustomers';

describe('Listcustomers', () => {
  let component: Listcustomers;
  let fixture: ComponentFixture<Listcustomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listcustomers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listcustomers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
