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
  ) { }

  ngOnInit(): void {
    this.listFloors();
    this.listBuildings();
  }

  // Get List of Buildings
  listFloors(): void {
    this.floors = this.floorService.listFloors();
  }

  // Get Building Name
  getBuildingName(id: number): string {
    const building = this.buildings.find((b) => b.id === id);
    return building ? building.name : 'Unknown';
    this.cdr.markForCheck();
  }

  // Building List
  listBuildings(): void {
    this.buildingService.listBuildings().subscribe(
      (data: Building[]) => {
        this.buildings = data;
        this.cdr.markForCheck();
      }
    );
  }

  // View Building
  viewFloors(id: number): void {
    this.router.navigate(['viewfloors', id]);
  }

  // Edit Building
  editFloors(id: number): void {
    this.router.navigate(['editfloors', id]);
  }

  // Delete Building
  deleteFloors(id: number): void {
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

  // Returns true if the floor is completed
isComplete(expectedEndDate: Date | string): boolean {
  const today = new Date();
  const expected = new Date(expectedEndDate);
  return expected <= today;
}

// Returns a human-readable time left
getTimeLeft(expectedEndDate: Date | string): string {
  const today = new Date();
  const endDate = new Date(expectedEndDate);

  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `${diffDays} day(s) left`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else {
    return 'Past due';
  }
}


}
