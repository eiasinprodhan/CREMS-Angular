import { ChangeDetectorRef, Component } from '@angular/core';
import { FloorService } from '../../../services/floor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listfloors',
  standalone: false,
  templateUrl: './listfloors.html',
  styleUrl: './listfloors.css'
})
export class Listfloors {
  floors!: any;

  constructor(
    private floorService: FloorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listFloors();
  }

  // Get List of Buildings
  listFloors(): void {
    this.floors = this.floorService.listFloors();
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
      }
    });
  }
}
