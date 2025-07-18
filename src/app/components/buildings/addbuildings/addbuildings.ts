import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../../models/project.model';
import { BuildingService } from '../../../services/building.service';
import { ProjectService } from '../../../services/project.service';
import { EmployeeService } from '../../../services/employee.service';


@Component({
  selector: 'app-addbuildings',
  standalone: false,
  templateUrl: './addbuildings.html',
  styleUrl: './addbuildings.css'
})
export class Addbuildings implements OnInit {
  addBuildingForm!: FormGroup;
  projects!: any;
  siteManagers!:any;

  message: string = '';
  messageType: string = '';

  constructor(
    private buildingService: BuildingService,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.addBuildingForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      project: ['', Validators.required],
      siteManager: ['', [Validators.required]],
      floorCount: [0],
      unitCount: [0],
      photo: ['']
    });

    this.listProjects();
    this.viewSiteManager();

  }

  addBuildings(): void {
    if (this.addBuildingForm.invalid) {
      this.addBuildingForm.markAllAsTouched();
      return;
    }

    this.buildingService.addBuildings(this.addBuildingForm.value).subscribe({
      next: () => {
        this.message = 'Building added successfully!';
        this.messageType = 'success';
        this.addBuildingForm.reset();
      },
      error: (err) => {
        this.message = 'Failed to add building. Please try again.';
        this.messageType = 'danger';
        console.error(err);
      }
    });
  }

  listProjects(): void {
    this.projects = this.projectService.listProjects();
  }

  viewSiteManager(): void {
    this.siteManagers = this.employeeService.viewEmployeeByRole("Site Manager");
  }
}
