import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editfloors } from './editfloors';

describe('Editfloors', () => {
  let component: Editfloors;
  let fixture: ComponentFixture<Editfloors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editfloors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editfloors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
