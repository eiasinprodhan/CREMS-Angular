import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listbuildings } from './listbuildings';

describe('Listbuildings', () => {
  let component: Listbuildings;
  let fixture: ComponentFixture<Listbuildings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listbuildings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listbuildings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
