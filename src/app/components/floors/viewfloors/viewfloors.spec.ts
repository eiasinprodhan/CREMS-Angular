import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewfloors } from './viewfloors';

describe('Viewfloors', () => {
  let component: Viewfloors;
  let fixture: ComponentFixture<Viewfloors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewfloors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewfloors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
