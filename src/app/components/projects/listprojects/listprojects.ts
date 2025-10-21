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
  projects: any[] = [];
  filteredProjects: any[] = [];
  paginatedProjects: any[] = [];
  isLoading: boolean = false;

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID and Name
  selectedStatus: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Status options
  statusOptions: string[] = ['All', 'Up Coming', 'Under Construction', 'Completed'];
  
  // Items per page options
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.listProjects();
  }

  listProjects(): void {
    this.isLoading = true;
    console.log('Fetching projects...');
    
    this.projectService.listProjects().subscribe({
      next: (data) => {
        console.log('Projects received:', data);
        this.projects = data || [];
        this.isLoading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
        this.isLoading = false;
        this.projects = [];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Total projects:', this.projects.length);
    
    let filtered = [...this.projects];

    // Filter by ID or Name (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(project => {
        const matchesId = project.id.toString().includes(searchLower);
        const matchesName = project.name.toLowerCase().includes(searchLower);
        return matchesId || matchesName;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    // Filter by Status
    if (this.selectedStatus && this.selectedStatus !== 'All' && this.selectedStatus !== '') {
      filtered = filtered.filter(project => 
        this.getProjectStatus(project) === this.selectedStatus
      );
      console.log('Filtered by Status:', filtered.length);
    }

    this.filteredProjects = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered projects:', this.filteredProjects.length);
    console.log('Total items:', this.totalItems);
    console.log('Total pages:', this.totalPages);
    
    // Reset to first page when filters change
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjects = this.filteredProjects.slice(startIndex, endIndex);
    
    console.log('Paginated projects:', this.paginatedProjects.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    console.log('Current page:', this.currentPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onItemsPerPageChange(): void {
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  viewProjects(id: number): void {
    this.router.navigate(['viewprojects', id]);
  }

  editProjects(id: number): void {
    this.router.navigate(['editprojects', id]);
  }

  deleteProjects(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProjects(id).subscribe({
        next: (res) => {
          console.log('Project deleted successfully', res);
          this.listProjects();
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          alert('Error deleting project. Please try again.');
        }
      });
    }
  }

  getProjectStatus(project: any): string {
    if (!project) return 'Unknown';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(project.startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(project.expectedEndDate);
    end.setHours(0, 0, 0, 0);

    if (!project.startDate || !project.expectedEndDate) return 'Unknown';

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

  getShowingText(): string {
    if (this.totalItems === 0) return 'Showing 0 to 0 of 0 entries';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }
}