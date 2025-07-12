import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listfloors } from './listfloors';

describe('Listfloors', () => {
  let component: Listfloors;
  let fixture: ComponentFixture<Listfloors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listfloors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listfloors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
