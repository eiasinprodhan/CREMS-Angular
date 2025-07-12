import { ChangeDetectorRef, Component } from '@angular/core';
import { FloorService } from '../../../services/floor.service';
import { Router } from '@angular/router';
import { BuildingService } from '../../../services/building.service';
import { Building } from '../../../models/building.model';

@Component({
  selector: 'app-listfloors',
  standalone: false,
  templateUrl: './listfloors.html',
  styleUrl: './listfloors.css',
})
export class Listfloors {
  floors!: any;
  buildings!: Building[];

  constructor(
    private floorService: FloorService,
    private buildingService: BuildingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listFloors();
    this.listBuildings();
  }

  // Get List of Buildings
  listFloors(): void {
    this.floors = this.floorService.listFloors();
  }

  // Get Building Name
  getBuildingName(id: string): string {
    const building = this.buildings.find((b) => b.id === id);
    return building ? building.name : 'Unknown';
  }

  // Building List
  listBuildings(): void {
  this.buildingService.listBuildings().subscribe(
    (data: Building[]) => {
      this.buildings = data;
    }
  );
}

  // View Building
  viewFloors(id: string): void {
    this.router.navigate(['viewfloors', id]);
  }

  // Edit Building
  editFloors(id: string): void {
    this.router.navigate(['editfloors', id]);
  }

  // Delete Building
  deleteFloors(id: string): void {
    this.floorService.deleteFloors(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.reattach();
        this.listFloors();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
