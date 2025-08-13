import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitService } from '../../../services/unit.service';
import { Unit } from '../../../models/unit.model';
import { ActivatedRoute } from '@angular/router';
import { BuildingService } from '../../../services/building.service';
import { FloorService } from '../../../services/floor.service';
import { Floor } from '../../../models/floor.model';

@Component({
  selector: 'app-addunits',
  standalone: false,
  templateUrl: './addunits.html',
  styleUrl: './addunits.css',
})
export class Addunits {
  floorId!: string;
  floor: Floor = new Floor();
  addUnitForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  constructor(
    private unitService: UnitService,
    private floorService: FloorService,
    private formBuilder: FormBuilder,
    private ar: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.floorId = this.ar.snapshot.params['id'];

    this.addUnitForm = this.formBuilder.group({
      unitNumber: ['', Validators.required],
      buildingId: [''],
      floorId: [this.floorId, Validators.required],
      area: [0, [Validators.required, Validators.min(1)]],
      bedrooms: [0, [Validators.required, Validators.min(1)]],
      bathrooms: [0, [Validators.required, Validators.min(1)]],
      isBooked: [false, Validators.required],
      customerId: [''],
      price: [0],
      photoUrls: this.formBuilder.array([this.createPhotoUrl()]),
    });

    this.loadFloors();
  }

  loadFloors(): void {
    this.floorService.viewFloors(this.floorId).subscribe({
      next: (data) => {
        this.floor = data;

        this.addUnitForm.patchValue({
          buildingId: this.floor.building || ''
        });
      },
      error: (err) => {
        console.error('Error loading floor:', err);
      }
    });
  }

  createPhotoUrl(): FormGroup {
    return this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  addPhotoUrl() {
    const photoUrls = this.addUnitForm.get('photoUrls') as FormArray;
    photoUrls.push(this.createPhotoUrl());
  }

  get photoUrls(): FormArray {
    return this.addUnitForm.get('photoUrls') as FormArray;
  }

  addUnit(): void {
    if (this.addUnitForm.invalid) {
      this.message = 'Please fill out all required fields.';
      this.messageType = 'danger';
      this.markAllFieldsAsTouched();
      return;
    }

    const formValue = this.addUnitForm.value;

    // Map photoUrls from [{url: string}] to string[]
    const photoUrlsArray = formValue.photoUrls.map((p: { url: string }) => p.url);

    const unit: Unit = {
      ...formValue,
      photoUrls: photoUrlsArray,
    };

    console.log('Submitting unit:', unit);

    this.unitService.addUnit(unit).subscribe({
      next: () => {
        this.message = 'Unit Added Successfully.';
        this.messageType = 'success';

        this.addUnitForm.reset();
        this.addUnitForm.patchValue({
          floorId: this.floorId,
          buildingId: this.floor.building || ''
        });
        this.addUnitForm.setControl('photoUrls', this.formBuilder.array([this.createPhotoUrl()]));
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to add unit. Please try again.';
        this.messageType = 'danger';
      },
    });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.addUnitForm.controls).forEach((field) => {
      const control = this.addUnitForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    this.photoUrls.controls.forEach(control => control.markAsTouched());
  }
}
