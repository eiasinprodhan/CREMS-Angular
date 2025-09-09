import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  id!: number;
  project: Project = new Project();
  buildings: Observable<Building[]> = of([]);

  constructor(
    private projectService: ProjectService,
    private buildingService: BuildingService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.viewProjects();
    this.listBuildingByproject();
  }

  viewProjects(): void {
    this.projectService.viewProjects(this.id).subscribe({
      next: (data) => {
        this.project = data;
        console.log(data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  listBuildingByproject() {
    this.buildings = this.buildingService.listBuildingByproject(this.id);
  }


  get projectStatus(): string {
    const today = new Date();

    if (!this.project?.startDate || !this.project?.expectedEndDate) {
      return 'Unknown';
    }

    const start = new Date(this.project.startDate);
    const end = new Date(this.project.expectedEndDate);

    if (today < start) return 'Up Coming';
    if (today > end) return 'Completed';
    return 'Under Construction';
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'up coming':
        return 'bg-primary rounded-pill';
      case 'under construction':
        return 'bg-warning rounded-pill';
      case 'completed':
        return 'bg-success rounded-pill';
      default:
        return 'bg-danger rounded-pill';
    }
  }
}
