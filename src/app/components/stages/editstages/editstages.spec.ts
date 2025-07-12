import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editstages } from './editstages';

describe('Editstages', () => {
  let component: Editstages;
  let fixture: ComponentFixture<Editstages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editstages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editstages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
