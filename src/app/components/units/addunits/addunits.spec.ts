import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addunits } from './addunits';

describe('Addunits', () => {
  let component: Addunits;
  let fixture: ComponentFixture<Addunits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addunits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addunits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
