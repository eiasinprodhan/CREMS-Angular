import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listtransactions } from './listtransactions';

describe('Listtransactions', () => {
  let component: Listtransactions;
  let fixture: ComponentFixture<Listtransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listtransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listtransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
