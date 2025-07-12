import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { BuildingService } from '../../../services/building.service';

@Component({
  selector: 'app-viewemployees',
  standalone: false,
  templateUrl: './viewemployees.html',
  styleUrl: './viewemployees.css'
})
export class Viewemployees implements OnInit{
  id!: string;
  employee: Employee = new Employee();
  workHistoryData!: any;

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private buildingService: BuildingService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.viewEmployee();
  }

  viewEmployee(): void {
    this.employeeService.viewEmployee(this.id).subscribe({
      next: (data) => {
        this.employee = data;
        this.workHistory(this.employee.id, this.employee.role);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching employee:', error);
      }
    });
  }

  viewBuilding(id: string): void {
    this.router.navigate(['viewbuildings', id]);
  }

  workHistory(id: string, role: string){
    if(role==="Project Manager"){
      this.workHistoryData = this.projectService.listWorkHistory(id);
    }
    else if(role==="Site Manager"){
      this.workHistoryData = this.buildingService.listWorkHistory(id);
    }
  }

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
