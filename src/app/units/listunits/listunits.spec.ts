import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listunits } from './listunits';

describe('Listunits', () => {
  let component: Listunits;
  let fixture: ComponentFixture<Listunits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listunits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listunits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
