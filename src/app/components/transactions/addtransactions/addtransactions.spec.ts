import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addtransactions } from './addtransactions';

describe('Addtransactions', () => {
  let component: Addtransactions;
  let fixture: ComponentFixture<Addtransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addtransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addtransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
