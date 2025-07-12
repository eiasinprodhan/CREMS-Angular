import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewrawmaterials } from './viewrawmaterials';

describe('Viewrawmaterials', () => {
  let component: Viewrawmaterials;
  let fixture: ComponentFixture<Viewrawmaterials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Viewrawmaterials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Viewrawmaterials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
