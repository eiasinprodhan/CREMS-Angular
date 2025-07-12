import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addbuildings } from './addbuildings';

describe('Addbuildings', () => {
  let component: Addbuildings;
  let fixture: ComponentFixture<Addbuildings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addbuildings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addbuildings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
