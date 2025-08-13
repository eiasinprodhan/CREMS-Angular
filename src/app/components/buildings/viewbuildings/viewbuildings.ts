import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Building } from '../../../models/building.model';
import { BuildingService } from '../../../services/building.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { FloorService } from '../../../services/floor.service';
import { Floor } from '../../../models/floor.model';

@Component({
  selector: 'app-viewbuildings',
  standalone: false,
  templateUrl: './viewbuildings.html',
  styleUrl: './viewbuildings.css'
})
export class Viewbuildings implements OnInit {
  id!: string;
  building: Building = new Building();
  project: Project = new Project();
  siteManager: Employee = new Employee();
  floors!: number;

  constructor(
    private buildingService: BuildingService,
    private projectService: ProjectService,
    private floorService: FloorService,
    private employeeService: EmployeeService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.viewBuilding();
    this.getFloorsById();
  }

  viewBuilding(): void {
    this.buildingService.viewBuildings(this.id).subscribe({
      next: (data) => {
        this.building = data;
        this.viewProjectDetails(this.building.project);
        this.viewSiteManager(this.building.siteManager);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching building:', error);
      }
    });
  }

  viewProjects(id: string): void {
    this.router.navigate(['viewprojects', id]);
  }

  viewProjectDetails(id: string): void {
    this.projectService.viewProjects(id).subscribe({
      next: (data) => {
        this.project = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  viewSiteManager(id: string): void {
    this.employeeService.viewEmployee(id).subscribe({
      next: (data) => {
        this.siteManager = data;
        console.log(this.siteManager);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getFloorsById(): void {
    this.floorService.getFloorByBuildingId(this.id).subscribe(data => {
      this.floors = data.length;
    });
  }
}
