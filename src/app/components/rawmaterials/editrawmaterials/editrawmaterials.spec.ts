import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editrawmaterials } from './editrawmaterials';

describe('Editrawmaterials', () => {
  let component: Editrawmaterials;
  let fixture: ComponentFixture<Editrawmaterials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Editrawmaterials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editrawmaterials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
