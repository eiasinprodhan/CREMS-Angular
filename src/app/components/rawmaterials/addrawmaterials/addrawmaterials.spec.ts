import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addrawmaterials } from './addrawmaterials';

describe('Addrawmaterials', () => {
  let component: Addrawmaterials;
  let fixture: ComponentFixture<Addrawmaterials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Addrawmaterials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addrawmaterials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
