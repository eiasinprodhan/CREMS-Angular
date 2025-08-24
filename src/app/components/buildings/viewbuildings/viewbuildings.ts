import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Building } from '../../../models/building.model';
import { BuildingService } from '../../../services/building.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { FloorService } from '../../../services/floor.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-viewbuildings',
  standalone: false,
  templateUrl: './viewbuildings.html',
  styleUrl: './viewbuildings.css'
})
export class Viewbuildings implements OnInit {
  id!: number;
  building: Building = new Building();
  project: Project = new Project();
  siteManager: Employee = new Employee();
  floors: number = 0; // ✅ Only completed floors
  buildingStatus: number = 0;

  constructor(
    private buildingService: BuildingService,
    private projectService: ProjectService,
    private floorService: FloorService,
    private employeeService: EmployeeService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = +this.ar.snapshot.params['id'];

    forkJoin({
      building: this.buildingService.viewBuildings(this.id),
      floors: this.floorService.getFloorByBuildingId(this.id)
    }).subscribe({
      next: ({ building, floors }) => {
        this.building = building;

        // ✅ Count only completed floors
        const today = new Date();
        this.floors = floors.filter(floor => new Date(floor.expectedEndDate) <= today).length;

        this.viewProjectDetails(building.project);
        this.viewSiteManager(building.siteManager);
        this.getBuildingStatus();
      },
      error: (error) => {
        console.error('Error loading building or floors:', error);
      }
    });
  }

  viewProjects(id: number): void {
    this.router.navigate(['viewprojects', id]);
  }

  viewProjectDetails(id: number): void {
    this.projectService.viewProjects(id).subscribe({
      next: (data) => {
        this.project = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading project:', error);
      }
    });
  }

  viewSiteManager(id: number): void {
    this.employeeService.viewEmployee(id).subscribe({
      next: (data) => {
        this.siteManager = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading site manager:', error);
      }
    });
  }

  getBuildingStatus(): void {
    if (this.building.floorCount && this.floors != null) {
      this.buildingStatus = (this.floors / this.building.floorCount) * 100;
    } else {
      this.buildingStatus = 0;
    }
    this.cdr.markForCheck();
  }
}
