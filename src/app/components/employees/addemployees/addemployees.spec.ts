import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addemployees } from './addemployees';

describe('Addemployees', () => {
  let component: Addemployees;
  let fixture: ComponentFixture<Addemployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addemployees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addemployees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
