import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listprojects',
  standalone: false,
  templateUrl: './listprojects.html',
  styleUrl: './listprojects.css'
})
export class Listprojects implements OnInit {
  projects!: any;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listProjects();
  }

  listProjects(): void {
    this.projects = this.projectService.listProjects();
  }

  viewProjects(id: number): void {
    this.router.navigate(['viewprojects', id]);
  }

  editProjects(id: number): void {
    this.router.navigate(['editprojects', id]);
  }

  deleteProjects(id: number): void {
    this.projectService.deleteProjects(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.reattach();
        this.listProjects();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getProjectStatus(project: any): string {
    const today = new Date();

    const start = new Date(project.startDate);
    const end = new Date(project.expectedEndDate);

    if (!start || !end) return 'Unknown';

    if (today < start) return 'Up Coming';
    if (today > end) return 'Completed';
    return 'Under Construction';
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
