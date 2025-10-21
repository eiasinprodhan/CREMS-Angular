import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Unit } from '../../../models/unit.model';
import { UnitService } from '../../../services/unit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listunits',
  standalone: false,
  templateUrl: './listunits.html',
  styleUrl: './listunits.css'
})
export class Listunits implements OnInit {
  units: Unit[] = [];
  filteredUnits: Unit[] = [];
  paginatedUnits: Unit[] = [];
  isLoading: boolean = false;

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID and Unit Number
  selectedBookedStatus: string = '';
  sortByArea: string = ''; // 'asc', 'desc', or ''
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Filter options
  bookedStatusOptions: string[] = ['All', 'Booked', 'Available'];
  sortOptions: any[] = [
    { value: '', label: 'No Sorting' },
    { value: 'asc', label: 'Area (Low to High)' },
    { value: 'desc', label: 'Area (High to Low)' }
  ];
  
  // Items per page options
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private unitService: UnitService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.listUnits();
  }

  listUnits(): void {
    this.isLoading = true;
    console.log('Fetching units...');
    
    this.unitService.listUnits().subscribe({
      next: (data) => {
        console.log('Units received:', data);
        this.units = data || [];
        this.isLoading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching units:', error);
        this.isLoading = false;
        this.units = [];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Total units:', this.units.length);
    
    let filtered = [...this.units];

    // Filter by ID or Unit Number (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(unit => {
        const matchesId = unit.id.toString().includes(searchLower);
        const matchesUnitNumber = unit.unitNumber.toLowerCase().includes(searchLower);
        return matchesId || matchesUnitNumber;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    // Filter by Booked Status
    if (this.selectedBookedStatus && this.selectedBookedStatus !== 'All' && this.selectedBookedStatus !== '') {
      if (this.selectedBookedStatus === 'Booked') {
        filtered = filtered.filter(unit => unit.booked === true);
      } else if (this.selectedBookedStatus === 'Available') {
        filtered = filtered.filter(unit => unit.booked === false);
      }
      console.log('Filtered by Booked Status:', filtered.length);
    }

    // Sort by Area
    if (this.sortByArea) {
      filtered.sort((a, b) => {
        if (this.sortByArea === 'asc') {
          return a.area - b.area;
        } else if (this.sortByArea === 'desc') {
          return b.area - a.area;
        }
        return 0;
      });
      console.log('Sorted by Area:', this.sortByArea);
    }

    this.filteredUnits = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered units:', this.filteredUnits.length);
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
    this.paginatedUnits = this.filteredUnits.slice(startIndex, endIndex);
    
    console.log('Paginated units:', this.paginatedUnits.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    console.log('Current page:', this.currentPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onBookedStatusChange(): void {
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
    this.selectedBookedStatus = '';
    this.sortByArea = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  bookUnit(id: number): void {
    this.router.navigate(['bookunit', id]);
  }

  viewUnit(id: number): void {
    this.router.navigate(['viewunits', id]);
  }

  editUnit(id: number): void {
    this.router.navigate(['editunits', id]);
  }

  deleteUnit(id: number): void {
    if (confirm('Are you sure you want to delete this unit?')) {
      this.unitService.deleteUnit(id).subscribe({
        next: (res) => {
          console.log('Unit deleted successfully', res);
          this.listUnits();
        },
        error: (error) => {
          console.error('Error deleting unit:', error);
          alert('Error deleting unit. Please try again.');
        }
      });
    }
  }

  getBookedClass(booked: boolean): string {
    return booked ? 'bg-success' : 'bg-danger';
  }

  getBookedText(booked: boolean): string {
    return booked ? 'Booked' : 'Available';
  }

  getShowingText(): string {
    if (this.totalItems === 0) return 'Showing 0 to 0 of 0 entries';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }

  getBookedCount(): number {
    return this.units.filter(u => u.booked).length;
  }

  getAvailableCount(): number {
    return this.units.filter(u => !u.booked).length;
  }
}