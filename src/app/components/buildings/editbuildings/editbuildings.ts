import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuildingService } from '../../../services/building.service';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../models/project.model';
import { Building } from '../../../models/building.model';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-editbuildings',
  standalone: false,
  templateUrl: './editbuildings.html',
  styleUrl: './editbuildings.css'
})
export class Editbuildings implements OnInit {
  id!: number;
  building: Building = new Building();
  siteManagers!:any;
  photoFile!: File;

  projects: Project[] = [];
  message: string = '';
  messageType: string = '';

  constructor(
    private ar: ActivatedRoute,
    private buildingService: BuildingService,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.loadBuilding();
    this.loadProjects();
    this.viewSiteManager();
  }

  loadBuilding(): void {
    this.buildingService.viewBuildings(this.id).subscribe({
      next: (data) => {
        this.building = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadProjects(): void {
    this.projectService.listProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  updateBuilding(): void {
    this.buildingService.editBuildings(this.building, this.photoFile).subscribe({
      next: () => {
        this.message = 'Building updated successfully!';
        this.messageType = 'success';
        this.router.navigate(['/listbuildings']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  viewSiteManager(): void {
    this.siteManagers = this.employeeService.viewEmployeeByRole("Site Manager");
  }

  onPhotoSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.photoFile = event.target.files[0];
      console.log('Selected file:', this.photoFile);
    }
  }

  compareProjects(p1: Project, p2: Project): boolean {
  return p1 && p2 ? p1.id === p2.id : p1 === p2;
}

compareEmployees(e1: any, e2: any): boolean {
  return e1 && e2 ? e1.id === e2.id : e1 === e2;
}


}
