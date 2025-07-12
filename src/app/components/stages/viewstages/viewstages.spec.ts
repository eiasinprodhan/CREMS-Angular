import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewstages } from './viewstages';

describe('Viewstages', () => {
  let component: Viewstages;
  let fixture: ComponentFixture<Viewstages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewstages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewstages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
