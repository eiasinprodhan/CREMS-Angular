import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editattendances } from './editattendances';

describe('Editattendances', () => {
  let component: Editattendances;
  let fixture: ComponentFixture<Editattendances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editattendances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editattendances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
