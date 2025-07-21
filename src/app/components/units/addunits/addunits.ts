import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitService } from '../../../services/unit.service';
import { Unit } from '../../../models/unit.model';
import { ActivatedRoute } from '@angular/router';
import { BuildingService } from '../../../services/building.service';

@Component({
  selector: 'app-addunits',
  standalone: false,
  templateUrl: './addunits.html',
  styleUrl: './addunits.css',
})
export class Addunits {
  floorId!: string;
  buildings: any[] = [];
  addUnitForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  constructor(
    private unitService: UnitService,
    private buildingService: BuildingService,
    private formBuilder: FormBuilder,
    private ar: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.floorId = this.ar.snapshot.params['id'];
    const buildingId = this.ar.snapshot.queryParams['buildingId'];

    this.loadBuildings();

    this.addUnitForm = this.formBuilder.group({
      unitNumber: ['', Validators.required],
      buildingId: [''],
      floorId: [''],
      area: [0, [Validators.required, Validators.min(1)]],
      bedrooms: [0, [Validators.required, Validators.min(1)]],
      bathrooms: [0, [Validators.required, Validators.min(1)]],
      isBooked: [false, Validators.required],
      customerId: [''],
      photoUrls: this.formBuilder.array([this.createPhotoUrl()]),
    });

    // Patch floorId and buildingId (if available)
    this.addUnitForm.patchValue({
      floorId: this.floorId,
      buildingId: buildingId || '',
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

        // Optionally reset floorId and buildingId after reset
        this.addUnitForm.patchValue({
          floorId: this.floorId,
          buildingId: this.addUnitForm.value.buildingId || '',
        });
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

  loadBuildings(): void {
    this.buildingService.listBuildings().subscribe({
      next: (data) => {
        this.buildings = data;
      },
      error: (err) => {
        console.error('Failed to load buildings', err);
      },
    });
  }
}
