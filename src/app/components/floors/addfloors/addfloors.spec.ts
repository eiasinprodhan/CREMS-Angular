import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addfloors } from './addfloors';

describe('Addfloors', () => {
  let component: Addfloors;
  let fixture: ComponentFixture<Addfloors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addfloors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addfloors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
