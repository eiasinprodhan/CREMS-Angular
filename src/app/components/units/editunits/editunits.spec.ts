import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editunits } from './editunits';

describe('Editunits', () => {
  let component: Editunits;
  let fixture: ComponentFixture<Editunits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editunits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editunits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
