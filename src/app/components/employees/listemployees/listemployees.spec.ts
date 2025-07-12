import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listemployees } from './listemployees';

describe('Listemployees', () => {
  let component: Listemployees;
  let fixture: ComponentFixture<Listemployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listemployees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listemployees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
