import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editbuildings } from './editbuildings';

describe('Editbuildings', () => {
  let component: Editbuildings;
  let fixture: ComponentFixture<Editbuildings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editbuildings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editbuildings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
