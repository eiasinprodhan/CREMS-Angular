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
  id!: string;
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
    this. viewEmployees();
  }

  // View Project

  viewProjects(): void {
    this.projectService.viewProjects(this.id).subscribe({
      next: (data) => {
        this.project = data;
        console.log(data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Edit Project
  updateProject():void{
    this.projectService.editProjects(this.id, this.project).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['listprojects']);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  // View Employees
  viewEmployees(): void {
    this.projectManagers = this.employeeService.viewEmployeeByRole("Project Manager");
    console.log(this.projectManagers);
  }
}
