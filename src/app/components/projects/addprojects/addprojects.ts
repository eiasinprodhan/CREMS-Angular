import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../../models/project.model';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-addprojects',
  standalone: false,
  templateUrl: './addprojects.html',
  styleUrl: './addprojects.css',
})
export class Addprojects implements OnInit {
  addProjectForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  projectManagers!: any;

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(1)]],
      status: ['', Validators.required],
      projectType: ['', Validators.required],
      projectManager: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.viewProjectManager();
  }

  addProjects(): void {
    if (this.addProjectForm.invalid) {
      this.message = 'Please fill out all required fields.';
      this.messageType = 'danger';
      this.markAllFieldsAsTouched();
      return;
    }

    const project: Project = { ...this.addProjectForm.value };

    this.projectService.addProjects(project).subscribe({
      next: () => {
        this.message = 'Project Added Successfully.';
        this.messageType = 'success';
        this.addProjectForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to add project. Please try again.';
        this.messageType = 'danger';
      },
    });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.addProjectForm.controls).forEach((field) => {
      const control = this.addProjectForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  viewProjectManager(): void {
    this.projectManagers = this.employeeService.viewEmployeeByRole("Project Manager");
  }
}
