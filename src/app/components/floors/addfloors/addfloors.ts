import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FloorService } from '../../../services/floor.service';
import { BuildingService } from '../../../services/building.service';

@Component({
  selector: 'app-addfloors',
  standalone: false,
  templateUrl: './addfloors.html',
  styleUrl: './addfloors.css',
})
export class Addfloors implements OnInit{
  addFloorForm!: FormGroup;
  buildings!: any;

  message: string = '';
  messageType: string = '';


  constructor(
    private floorService: FloorService,
    private buildingService: BuildingService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.addFloorForm = this.formBuilder.group({
      name: ['', Validators.required],
      building: ['', Validators.required],
    });

    this.listBuildings();

  }

  addFloor(): void {
    if (this.addFloorForm.invalid) {
      this.addFloorForm.markAllAsTouched();
      return;
    }

    this.floorService.addFloors(this.addFloorForm.value).subscribe({
      next: () => {
        this.message = 'Floor added successfully!';
        this.messageType = 'success';
        this.addFloorForm.reset();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = 'Failed to add floor. Please try again.';
        this.messageType = 'danger';
        console.error(err);
      },
    });
  }

  listBuildings(): void {
    this.buildings = this.buildingService.listBuildings();
  }

}
