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
  styleUrl: './editfloors.css'
})
export class Editfloors {
  id!: string;
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
        });
        console.log(data);
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

    this.floorService.editFloors(this.id, this.editFloorForm.value).subscribe({
      next: (res) => {
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
        console.log(this.buildings);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
