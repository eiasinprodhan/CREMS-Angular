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
  ) { }

  ngOnInit(): void {
    this.listProjects();
  }

  //Projects List
  listProjects(): void {
    this.projects = this.projectService.listProjects();
  }

  // View Projects
  viewProjects(id: string): void{
    this.router.navigate(['viewprojects', id]);
  }

  editProjects(id: string): void{
    this.router.navigate(['editprojects', id]);
  }

  // Delete Project
  deleteProjects(id: string): void {
    this.projectService.deleteProjects(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.reattach();
        this.listProjects();
      },
      error: (error) => {
        console.log(error);
      }
    })
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
