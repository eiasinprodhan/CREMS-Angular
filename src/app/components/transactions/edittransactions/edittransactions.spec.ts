import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Edittransactions } from './edittransactions';

describe('Edittransactions', () => {
  let component: Edittransactions;
  let fixture: ComponentFixture<Edittransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Edittransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Edittransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
