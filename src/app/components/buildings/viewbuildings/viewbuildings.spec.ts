import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewbuildings } from './viewbuildings';

describe('Viewbuildings', () => {
  let component: Viewbuildings;
  let fixture: ComponentFixture<Viewbuildings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewbuildings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewbuildings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
