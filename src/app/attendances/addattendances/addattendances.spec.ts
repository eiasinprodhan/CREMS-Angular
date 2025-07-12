import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addattendances } from './addattendances';

describe('Addattendances', () => {
  let component: Addattendances;
  let fixture: ComponentFixture<Addattendances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addattendances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addattendances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
