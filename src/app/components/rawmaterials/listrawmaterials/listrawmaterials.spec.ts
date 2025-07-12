import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listrawmaterials } from './listrawmaterials';

describe('Listrawmaterials', () => {
  let component: Listrawmaterials;
  let fixture: ComponentFixture<Listrawmaterials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listrawmaterials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listrawmaterials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
