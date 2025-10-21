import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listemployees',
  standalone: false,
  templateUrl: './listemployees.html',
  styleUrl: './listemployees.css'
})
export class Listemployees implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  paginatedEmployees: any[] = [];
  isLoading: boolean = false;

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID and Name
  selectedRole: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Role options - will be populated from data
  roleOptions: string[] = ['All'];
  
  // Items per page options
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.listEmployees();
  }

  listEmployees(): void {
    this.isLoading = true;
    console.log('Fetching employees...');
    
    this.employeeService.listEmployees().subscribe({
      next: (data) => {
        console.log('Employees received:', data);
        this.employees = data || [];
        this.isLoading = false;
        this.extractRoles(); // Get unique roles from data
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.isLoading = false;
        this.employees = [];
        this.applyFilters();
      }
    });
  }

  // Extract unique roles from employees data
  extractRoles(): void {
    const roles = this.employees.map(employee => employee.role).filter(role => role);
    const uniqueRoles = [...new Set(roles)];
    this.roleOptions = ['All', ...uniqueRoles.sort()];
    console.log('Available roles:', this.roleOptions);
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Total employees:', this.employees.length);
    
    let filtered = [...this.employees];

    // Filter by ID or Name (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(employee => {
        const matchesId = employee.id.toString().includes(searchLower);
        const matchesName = employee.name.toLowerCase().includes(searchLower);
        return matchesId || matchesName;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    // Filter by Role
    if (this.selectedRole && this.selectedRole !== 'All' && this.selectedRole !== '') {
      filtered = filtered.filter(employee => 
        employee.role === this.selectedRole
      );
      console.log('Filtered by Role:', filtered.length);
    }

    this.filteredEmployees = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered employees:', this.filteredEmployees.length);
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
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
    
    console.log('Paginated employees:', this.paginatedEmployees.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    console.log('Current page:', this.currentPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onRoleChange(): void {
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
    this.selectedRole = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  viewEmployee(id: number): void {
    this.router.navigate(['viewemployees', id]);
  }

  editEmployee(id: number): void {
    this.router.navigate(['editemployees', id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (res) => {
          console.log('Employee deleted successfully', res);
          this.listEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          alert('Error deleting employee. Please try again.');
        }
      });
    }
  }

  formatRole(role: string): string {
    if (!role) return '';
    return role
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getRoleClass(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'bg-danger',
      'MANAGER': 'bg-primary',
      'SUPERVISOR': 'bg-info',
      'ENGINEER': 'bg-success',
      'TECHNICIAN': 'bg-warning',
      'LABOUR': 'bg-secondary',
      'WORKER': 'bg-secondary'
    };
    
    return roleMap[role.toUpperCase()] || 'bg-secondary';
  }

  getShowingText(): string {
    if (this.totalItems === 0) return 'Showing 0 to 0 of 0 entries';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }

  getRoleCount(role: string): number {
    return this.employees.filter(e => e.role === role).length;
  }
}