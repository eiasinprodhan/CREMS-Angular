import { ChangeDetectorRef, Component } from '@angular/core';
import { FloorService } from '../../../services/floor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Floor } from '../../../models/floor.model';
import { BuildingService } from '../../../services/building.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editfloors',
  standalone: false,
  templateUrl: './editfloors.html',
  styleUrl: './editfloors.css',
})
export class Editfloors {
  id!: number;
  editFloorForm!: FormGroup;
  floor: Floor = new Floor();
  buildings!: any[];
  message: string = '';
  messageType: string = '';

  constructor(
    private floorService: FloorService,
    private buildingService: BuildingService,
    private formBuilder: FormBuilder,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.editFloorForm = this.formBuilder.group({
      name: ['', Validators.required],
      building: ['', Validators.required],
      expectedEndDate: ['', Validators.required], // ✅ Added
    });

    this.listBuildings();
    this.viewFloor();
  }

  // View Floor
  viewFloor(): void {
    this.floorService.viewFloors(this.id).subscribe({
      next: (data) => {
        this.floor = data;
        this.editFloorForm.patchValue({
          name: this.floor.name,
          building: this.floor.building,
          expectedEndDate: this.formatDate(this.floor.expectedEndDate), // ✅ Format
        });
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Update Floor
  updateFloor(): void {
    if (this.editFloorForm.invalid) {
      this.editFloorForm.markAllAsTouched();
      return;
    }

    const updatedFloor = {
      ...this.editFloorForm.value,
      expectedEndDate: new Date(this.editFloorForm.value.expectedEndDate), id: this.id
    };

    this.floorService.editFloors(updatedFloor).subscribe({
      next: () => {
        this.message = 'Floor updated successfully!';
        this.messageType = 'success';
        this.router.navigate(['listfloors']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = 'Failed to update floor. Please try again.';
        this.messageType = 'danger';
        console.error(err);
      },
    });
  }

  // List Buildings
  listBuildings(): void {
    this.buildingService.listBuildings().subscribe({
      next: (data) => {
        this.buildings = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }


  private formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}
