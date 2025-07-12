import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editemployees } from './editemployees';

describe('Editemployees', () => {
  let component: Editemployees;
  let fixture: ComponentFixture<Editemployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editemployees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editemployees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
