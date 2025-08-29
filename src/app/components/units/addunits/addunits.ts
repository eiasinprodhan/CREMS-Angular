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
  floorId!: number;
  floor: Floor = new Floor();
  addUnitForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  selectedFiles: File[] = [];  // <-- To hold selected files

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
      buildingId: [0],
      floorId: [this.floorId, Validators.required],
      area: [0, [Validators.required, Validators.min(1)]],
      bedrooms: [0, [Validators.required, Validators.min(1)]],
      bathrooms: [0, [Validators.required, Validators.min(1)]],
      booked: [false, Validators.required],
      customerId: [0],
      price: [0],
      // Removed photoUrls from form since files will be handled separately
    });

    this.loadFloors();
  }

  loadFloors(): void {
    this.floorService.viewFloors(this.floorId).subscribe({
      next: (data) => {
        this.floor = data;

        this.addUnitForm.patchValue({
          buildingId: this.floor.building || 0,
        });
      },
      error: (err) => {
        console.error('Error loading floor:', err);
      },
    });
  }

  // Handle file input change event
  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);  // Store all selected files
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

    // Call service and pass both unit object and the files array
    this.unitService.addUnit(unit, this.selectedFiles).subscribe({
      next: () => {
        this.message = 'Unit Added Successfully.';
        this.messageType = 'success';

        this.addUnitForm.reset();
        this.addUnitForm.patchValue({
          floorId: this.floorId,
          buildingId: this.floor.building || 0,
        });

        this.selectedFiles = [];
        // Reset file input UI (optional)
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

  private markAllFieldsAsTouched() {
    Object.keys(this.addUnitForm.controls).forEach((field) => {
      const control = this.addUnitForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
