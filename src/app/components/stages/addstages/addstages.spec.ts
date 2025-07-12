import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addstages } from './addstages';

describe('Addstages', () => {
  let component: Addstages;
  let fixture: ComponentFixture<Addstages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addstages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addstages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
