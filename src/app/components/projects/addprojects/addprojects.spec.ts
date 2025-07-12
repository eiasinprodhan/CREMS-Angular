import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addprojects } from './addprojects';

describe('Addprojects', () => {
  let component: Addprojects;
  let fixture: ComponentFixture<Addprojects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addprojects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addprojects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
