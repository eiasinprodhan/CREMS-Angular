import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listprojects } from './listprojects';

describe('Listprojects', () => {
  let component: Listprojects;
  let fixture: ComponentFixture<Listprojects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listprojects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listprojects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
