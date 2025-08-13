import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuildingService } from '../../../services/building.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listbuildings',
  standalone: false,
  templateUrl: './listbuildings.html',
  styleUrl: './listbuildings.css'
})
export class Listbuildings implements OnInit {
  buildings!: any;

  constructor(
    private buildingService: BuildingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listBuildings();
  }

  // Get List of Buildings
  listBuildings(): void {
    this.buildings = this.buildingService.listBuildings();
  }

  // View Building
  viewBuildings(id: string): void {
    this.router.navigate(['viewbuildings', id]);
  }

  // Edit Building
  editBuildings(id: string): void {
    this.router.navigate(['editbuildings', id]);
  }

  // Delete Building
  deleteBuildings(id: string): void {
    this.buildingService.deleteBuildings(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.reattach();
        this.listBuildings();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
