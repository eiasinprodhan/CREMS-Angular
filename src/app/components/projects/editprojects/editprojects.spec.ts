import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editprojects } from './editprojects';

describe('Editprojects', () => {
  let component: Editprojects;
  let fixture: ComponentFixture<Editprojects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editprojects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editprojects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
