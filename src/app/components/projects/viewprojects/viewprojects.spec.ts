import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewprojects } from './viewprojects';

describe('Viewprojects', () => {
  let component: Viewprojects;
  let fixture: ComponentFixture<Viewprojects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewprojects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewprojects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
