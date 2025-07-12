import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Liststages } from './liststages';

describe('Liststages', () => {
  let component: Liststages;
  let fixture: ComponentFixture<Liststages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Liststages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Liststages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
