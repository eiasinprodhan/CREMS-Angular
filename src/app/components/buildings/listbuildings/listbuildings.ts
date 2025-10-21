import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuildingService } from '../../../services/building.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listbuildings',
  standalone: false,
  templateUrl: './listbuildings.html',
  styleUrl: './listbuildings.css'
})
export class Listbuildings implements OnInit {
  buildings: any[] = [];
  filteredBuildings: any[] = [];
  paginatedBuildings: any[] = [];
  isLoading: boolean = false;

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID and Name
  selectedType: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Type options - will be populated from data
  typeOptions: string[] = ['All'];
  
  // Items per page options
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private buildingService: BuildingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.listBuildings();
  }

  listBuildings(): void {
    this.isLoading = true;
    console.log('Fetching buildings...');
    
    this.buildingService.listBuildings().subscribe({
      next: (data) => {
        console.log('Buildings received:', data);
        this.buildings = data || [];
        this.isLoading = false;
        this.extractTypes(); // Get unique types from data
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching buildings:', error);
        this.isLoading = false;
        this.buildings = [];
        this.applyFilters();
      }
    });
  }

  // Extract unique types from buildings data
  extractTypes(): void {
    const types = this.buildings.map(building => building.type).filter(type => type);
    const uniqueTypes = [...new Set(types)];
    this.typeOptions = ['All', ...uniqueTypes.sort()];
    console.log('Available types:', this.typeOptions);
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Total buildings:', this.buildings.length);
    
    let filtered = [...this.buildings];

    // Filter by ID or Name (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(building => {
        const matchesId = building.id.toString().includes(searchLower);
        const matchesName = building.name.toLowerCase().includes(searchLower);
        return matchesId || matchesName;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    // Filter by Type
    if (this.selectedType && this.selectedType !== 'All' && this.selectedType !== '') {
      filtered = filtered.filter(building => 
        building.type === this.selectedType
      );
      console.log('Filtered by Type:', filtered.length);
    }

    this.filteredBuildings = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered buildings:', this.filteredBuildings.length);
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
    this.paginatedBuildings = this.filteredBuildings.slice(startIndex, endIndex);
    
    console.log('Paginated buildings:', this.paginatedBuildings.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    console.log('Current page:', this.currentPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onTypeChange(): void {
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
    this.selectedType = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  viewBuildings(id: number): void {
    this.router.navigate(['viewbuildings', id]);
  }

  editBuildings(id: number): void {
    this.router.navigate(['editbuildings', id]);
  }

  deleteBuildings(id: number): void {
    if (confirm('Are you sure you want to delete this building?')) {
      this.buildingService.deleteBuildings(id).subscribe({
        next: (res) => {
          console.log('Building deleted successfully', res);
          this.listBuildings();
        },
        error: (error) => {
          console.error('Error deleting building:', error);
          alert('Error deleting building. Please try again.');
        }
      });
    }
  }

  getTypeClass(type: string): string {
    // You can customize these based on your building types
    const typeMap: { [key: string]: string } = {
      'Residential': 'bg-primary',
      'Commercial': 'bg-success',
      'Industrial': 'bg-warning',
      'Mixed Use': 'bg-info',
      'Office': 'bg-secondary',
      'Retail': 'bg-danger'
    };
    
    return typeMap[type] || 'bg-secondary';
  }

  getShowingText(): string {
    if (this.totalItems === 0) return 'Showing 0 to 0 of 0 entries';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }
}