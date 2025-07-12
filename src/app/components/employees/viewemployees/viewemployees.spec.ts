import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewemployees } from './viewemployees';

describe('Viewemployees', () => {
  let component: Viewemployees;
  let fixture: ComponentFixture<Viewemployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewemployees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewemployees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
