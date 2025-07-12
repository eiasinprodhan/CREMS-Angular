import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { error } from 'console';
import { BuildingService } from '../../../services/building.service';
import { Observable, of } from 'rxjs';
import { Building } from '../../../models/building.model';

@Component({
  selector: 'app-viewprojects',
  standalone: false,
  templateUrl: './viewprojects.html',
  styleUrl: './viewprojects.css'
})
export class Viewprojects implements OnInit {
  id!: string;
  project: Project = new Project();
  employee: Employee = new Employee();
  buildings: Observable<Building[]> = of([]);

  constructor(
    private projectService: ProjectService,
    private buildingService: BuildingService,
    private employeeService: EmployeeService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.viewProjects();
    this.listBuildingByproject();
  }

  viewProjects(): void {
    this.projectService.viewProjects(this.id).subscribe({
      next: (data) => {
        this.project = data;
        this.viewEmployee(this.project.projectManager);
        console.log(data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  // View Employees
  viewEmployee(id: string): void{
    this.employeeService.viewEmployee(id).subscribe({
      next: (data) => {
        this.employee = data;
        console.log(data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  listBuildingByproject(){
    this.buildings = this.buildingService.listBuildingByproject(this.id);
  }

  // Project Status Design
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'up coming':
        return 'bg-primary';
      case 'under construction':
        return 'bg-warning';
      case 'completed':
        return 'bg-success';
      default:
        return 'bg-danger';
    }
  }

}
