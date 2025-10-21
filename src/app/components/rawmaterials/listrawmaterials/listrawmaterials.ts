import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RawmaterialsService } from '../../../services/rawmaterials.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listrawmaterials',
  standalone: false,
  templateUrl: './listrawmaterials.html',
  styleUrl: './listrawmaterials.css'
})
export class Listrawmaterials implements OnInit {
  rawmaterials: any[] = [];
  filteredRawMaterials: any[] = [];
  paginatedRawMaterials: any[] = [];
  isLoading: boolean = false;

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID and Name
  sortByQuantity: string = ''; // 'asc', 'desc', or ''
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Sort options
  sortOptions: any[] = [
    { value: '', label: 'No Sorting' },
    { value: 'asc', label: 'Quantity (Low to High)' },
    { value: 'desc', label: 'Quantity (High to Low)' }
  ];
  
  // Items per page options
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private rawMaterialsService: RawmaterialsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.listRawMaterials();
  }

  listRawMaterials(): void {
    this.isLoading = true;
    console.log('Fetching raw materials...');
    
    this.rawMaterialsService.listRawMaterials().subscribe({
      next: (data) => {
        console.log('Raw materials received:', data);
        this.rawmaterials = data || [];
        this.isLoading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching raw materials:', error);
        this.isLoading = false;
        this.rawmaterials = [];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Total raw materials:', this.rawmaterials.length);
    
    let filtered = [...this.rawmaterials];

    // Filter by ID or Name (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(material => {
        const matchesId = material.id.toString().includes(searchLower);
        const matchesName = material.name.toLowerCase().includes(searchLower);
        return matchesId || matchesName;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    // Sort by Quantity
    if (this.sortByQuantity) {
      filtered.sort((a, b) => {
        const quantityA = a.quantity || 0;
        const quantityB = b.quantity || 0;
        
        if (this.sortByQuantity === 'asc') {
          return quantityA - quantityB;
        } else if (this.sortByQuantity === 'desc') {
          return quantityB - quantityA;
        }
        return 0;
      });
      console.log('Sorted by Quantity:', this.sortByQuantity);
    }

    this.filteredRawMaterials = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered raw materials:', this.filteredRawMaterials.length);
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
    this.paginatedRawMaterials = this.filteredRawMaterials.slice(startIndex, endIndex);
    
    console.log('Paginated raw materials:', this.paginatedRawMaterials.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    console.log('Current page:', this.currentPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
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
    this.sortByQuantity = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  viewRawMaterial(id: number): void {
    this.router.navigate(['viewrawmaterials', id]);
  }

  editRawMaterial(id: number): void {
    this.router.navigate(['editrawmaterials', id]);
  }

  deleteRawMaterials(id: number): void {
    if (confirm('Are you sure you want to delete this raw material?')) {
      this.rawMaterialsService.deleteRawMaterials(id).subscribe({
        next: () => {
          console.log('Raw material deleted successfully');
          this.listRawMaterials();
        },
        error: (error) => {
          console.error('Delete failed', error);
          alert('Error deleting raw material. Please try again.');
        }
      });
    }
  }

  getShowingText(): string {
    if (this.totalItems === 0) return 'Showing 0 to 0 of 0 entries';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }

  getTotalQuantity(): number {
    return this.filteredRawMaterials.reduce((sum, material) => sum + (material.quantity || 0), 0);
  }

  getLowStockCount(): number {
    return this.rawmaterials.filter(m => (m.quantity || 0) < 10).length;
  }

  getStockStatus(quantity: number): { text: string; className: string } {
    if (quantity === 0) {
      return { text: 'Out of Stock', className: 'bg-danger' };
    } else if (quantity < 10) {
      return { text: 'Low Stock', className: 'bg-warning' };
    } else {
      return { text: 'In Stock', className: 'bg-success' };
    }
  }
}