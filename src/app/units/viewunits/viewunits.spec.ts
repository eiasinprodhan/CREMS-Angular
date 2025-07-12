import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewunits } from './viewunits';

describe('Viewunits', () => {
  let component: Viewunits;
  let fixture: ComponentFixture<Viewunits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewunits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewunits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
