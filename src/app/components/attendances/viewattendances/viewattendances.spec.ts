import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewattendances } from './viewattendances';

describe('Viewattendances', () => {
  let component: Viewattendances;
  let fixture: ComponentFixture<Viewattendances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewattendances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewattendances);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
