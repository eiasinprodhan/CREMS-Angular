import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bookunits } from './bookunits';

describe('Bookunits', () => {
  let component: Bookunits;
  let fixture: ComponentFixture<Bookunits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Bookunits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bookunits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
