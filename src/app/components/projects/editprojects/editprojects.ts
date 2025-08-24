import { ChangeDetectorRef, Component } from '@angular/core';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-editprojects',
  standalone: false,
  templateUrl: './editprojects.html',
  styleUrl: './editprojects.css',
})
export class Editprojects {
  id!: number;
  project: Project = new Project();
  projectManagers!: any;

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.viewProjects();
    this.viewEmployees();
  }

  // View Project
  viewProjects(): void {
    this.projectService.viewProjects(this.id).subscribe({
      next: (data) => {
        // Convert date objects to strings for input fields
        data.startDate = this.formatDate(data.startDate);
        data.expectedEndDate = this.formatDate(data.expectedEndDate);
        this.project = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Convert Date or date string to 'YYYY-MM-DD' format
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Edit Project
  updateProject(): void {
    // Convert string dates back to Date objects if needed by backend
    this.project.startDate = new Date(this.project.startDate);
    this.project.expectedEndDate = new Date(this.project.expectedEndDate);

    this.projectService.editProjects(this.project).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['listprojects']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  // View Employees
  viewEmployees(): void {
    this.projectManagers = this.employeeService.viewEmployeeByRole("Project Manager");
  }
}
