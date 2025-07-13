import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listattendances } from './listattendances';

describe('Listattendances', () => {
  let component: Listattendances;
  let fixture: ComponentFixture<Listattendances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listattendances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listattendances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
