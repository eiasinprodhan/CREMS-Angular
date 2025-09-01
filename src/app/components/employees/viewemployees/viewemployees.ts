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
export class Viewemployees implements OnInit {
  id!: number;
  employee: Employee = new Employee();
  workHistoryData: any;
  isInactive: boolean = true;

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private buildingService: BuildingService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.viewEmployee();
  }

  viewEmployee(): void {
    this.employeeService.viewEmployee(this.id).subscribe({
      next: (data) => {
        this.employee = data;
        this.workHistory(this.employee.id, this.employee.role);
      },
      error: (error) => {
        console.error('Error fetching employee:', error);
      }
    });
  }

  viewBuilding(id: number): void {
    this.router.navigate(['viewbuildings', id]);
  }

  workHistory(id: number, role: string): void {
    if (role === 'Project Manager') {
      this.workHistoryData = this.projectService.listWorkHistory(id);
    } else if (role === 'Site Manager') {
      this.workHistoryData = this.buildingService.listWorkHistory(id);
    } else {
      this.isInactive = true;  // Labour or unknown roles
      return;
    }

    this.workHistoryData.subscribe((data: any[]) => {
      if (!data || data.length === 0) {
        this.isInactive = true;
      } else {
        // Consider all ongoing if at least one project is ongoing
        const now = new Date();
        const hasOngoing = data.some(wh => new Date(wh.expectedEndDate) >= now);
        this.isInactive = !hasOngoing;
      }
      this.cdr.markForCheck();
    });
  }

  getDynamicStatus(expectedEndDate: string | Date): string {
    const today = new Date();
    const endDate = new Date(expectedEndDate);
    return endDate < today ? 'Completed' : 'Ongoing';
  }

  getStatusClass(status: string | undefined | null): string {
    if (!status) return 'bg-danger';

    switch (status.toLowerCase()) {
      case 'ongoing':
        return 'bg-warning';
      case 'completed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

}
