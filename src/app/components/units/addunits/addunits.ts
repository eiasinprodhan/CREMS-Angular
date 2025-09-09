import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitService } from '../../../services/unit.service';
import { Unit } from '../../../models/unit.model';
import { ActivatedRoute } from '@angular/router';
import { FloorService } from '../../../services/floor.service';
import { Floor } from '../../../models/floor.model';

@Component({
  selector: 'app-addunits',
  standalone: false,
  templateUrl: './addunits.html',
  styleUrl: './addunits.css',
})
export class Addunits {
  floorId!: number;
  floor: Floor = new Floor();
  addUnitForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  selectedFiles: File[] = [];

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
      building: [null, Validators.required],
      floor: [null, Validators.required],
      area: [0, [Validators.required, Validators.min(1)]],
      bedrooms: [0, [Validators.required, Validators.min(1)]],
      bathrooms: [0, [Validators.required, Validators.min(1)]],
      booked: [false, Validators.required],
      price: [0, Validators.required],
      interestRate: [0, Validators.required]
    });

    this.loadFloorAndPatchForm();
  }

  loadFloorAndPatchForm(): void {
    this.floorService.viewFloors(this.floorId).subscribe({
      next: (data) => {
        this.floor = data;

        this.addUnitForm.patchValue({
          floor: { id: this.floor.id },
          building: { id: this.floor.building.id }
        });
      },
      error: (err) => {
        console.error('Error loading floor:', err);
        this.message = 'Failed to load floor details.';
        this.messageType = 'danger';
      },
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  addUnit(): void {
    if (this.addUnitForm.invalid) {
      this.message = 'Please fill out all required fields.';
      this.messageType = 'danger';
      this.markAllFieldsAsTouched();
      return;
    }

    const unit: Unit = this.addUnitForm.value;

    unit.floor = { id: this.floor.id } as any;
    unit.building = { id: this.floor.building.id } as any;

    this.unitService.addUnit(unit, this.selectedFiles).subscribe({
      next: () => {
        this.message = 'Unit Added Successfully.';
        this.messageType = 'success';

        this.addUnitForm.reset();
        this.addUnitForm.patchValue({
          floor: { id: this.floor.id },
          building: { id: this.floor.building.id }
        });

        this.selectedFiles = [];

        const fileInput = document.getElementById('photoFiles') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to add unit. Please try again.';
        this.messageType = 'danger';
      },
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.addUnitForm.controls).forEach((field) => {
      const control = this.addUnitForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
