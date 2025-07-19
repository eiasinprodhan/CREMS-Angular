import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitService } from '../../../services/unit.service';
import { Unit } from '../../../models/unit.model';

@Component({
  selector: 'app-addunits',
  standalone: false,
  templateUrl: './addunits.html',
  styleUrl: './addunits.css',
})
export class Addunits {
  addUnitForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  projectManagers!: any;

  constructor(
    private unitService: UnitService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addUnitForm = this.formBuilder.group({
      unitNumber: ['', Validators.required],
      buildingId: ['dfgsdfg'],
      floorId: ['dfgsdg'],
      area: [0, [Validators.required, Validators.min(1)]],
      bedrooms: [0, [Validators.required, Validators.min(1)]],
      bathrooms: [0, [Validators.required, Validators.min(1)]],
      isBooked: [false, Validators.required],
      customerId: ['sdfsd', Validators.required],
      photoUrls: this.formBuilder.array([this.createPhotoUrl()]),
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

  addUnit(): void {
    if (this.addUnitForm.invalid) {
      this.message = 'Please fill out all required fields.';
      this.messageType = 'danger';
      this.markAllFieldsAsTouched();
      return;
    }

    const unit: Unit = { ...this.addUnitForm.value };

    this.unitService.addUnit(unit).subscribe({
      next: () => {
        this.message = 'Unit Added Successfully.';
        this.messageType = 'success';
        this.addUnitForm.reset();
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
  }

  get photoUrls(): FormArray {
    return this.addUnitForm.get('photoUrls') as FormArray;
  }
}
