import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-listbooking',
  standalone: false,
  templateUrl: './listbooking.html',
  styleUrls: ['./listbooking.css'],
})
export class Listbooking implements OnInit {
  enrichedBookings: any[] = [];
  filteredBookings: any[] = [];
  paginatedBookings: any[] = [];
  isLoading: boolean = false;

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID and Customer Name
  selectedBuilding: string = '';
  selectedFloor: string = '';
  sortByDueAmount: string = ''; // 'asc', 'desc', or ''
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Filter options - will be populated from data
  buildingOptions: any[] = [{ id: '', name: 'All Buildings' }];
  floorOptions: any[] = [{ id: '', name: 'All Floors' }];
  
  // Sort options
  sortOptions: any[] = [
    { value: '', label: 'No Sorting' },
    { value: 'asc', label: 'Due Amount (Low to High)' },
    { value: 'desc', label: 'Due Amount (High to Low)' }
  ];
  
  // Items per page options
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('Component initialized');
    this.listAllBookings();
  }

  listAllBookings(): void {
    this.isLoading = true;
    console.log('Fetching bookings...');
    
    this.bookingService.listBookings().subscribe({
      next: (data) => {
        console.log('Bookings received:', data);
        this.enrichedBookings = data || [];
        this.isLoading = false;
        this.extractFilterOptions();
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.isLoading = false;
        this.enrichedBookings = [];
        this.applyFilters();
      }
    });
  }

  // Extract unique buildings and floors from bookings data
  extractFilterOptions(): void {
    // Extract unique buildings
    const buildings = this.enrichedBookings
      .map(booking => booking.building)
      .filter((building, index, self) => 
        building && self.findIndex(b => b?.id === building?.id) === index
      );
    this.buildingOptions = [
      { id: '', name: 'All Buildings' },
      ...buildings.map(b => ({ id: b.id.toString(), name: b.name }))
    ];

    // Extract unique floors
    const floors = this.enrichedBookings
      .map(booking => booking.floor)
      .filter((floor, index, self) => 
        floor && self.findIndex(f => f?.id === floor?.id) === index
      );
    this.floorOptions = [
      { id: '', name: 'All Floors' },
      ...floors.map(f => ({ id: f.id.toString(), name: f.name }))
    ];

    console.log('Building options:', this.buildingOptions);
    console.log('Floor options:', this.floorOptions);
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Total bookings:', this.enrichedBookings.length);
    
    let filtered = [...this.enrichedBookings];

    // Filter by ID or Customer Name (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(booking => {
        const matchesId = booking.id.toString().includes(searchLower);
        const matchesCustomerName = booking.customer?.name?.toLowerCase().includes(searchLower) || false;
        return matchesId || matchesCustomerName;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    // Filter by Building
    if (this.selectedBuilding && this.selectedBuilding !== '') {
      filtered = filtered.filter(booking => 
        booking.building?.id?.toString() === this.selectedBuilding
      );
      console.log('Filtered by Building:', filtered.length);
    }

    // Filter by Floor
    if (this.selectedFloor && this.selectedFloor !== '') {
      filtered = filtered.filter(booking => 
        booking.floor?.id?.toString() === this.selectedFloor
      );
      console.log('Filtered by Floor:', filtered.length);
    }

    // Sort by Due Amount
    if (this.sortByDueAmount) {
      filtered.sort((a, b) => {
        const amountA = a.dueAmount || 0;
        const amountB = b.dueAmount || 0;
        
        if (this.sortByDueAmount === 'asc') {
          return amountA - amountB;
        } else if (this.sortByDueAmount === 'desc') {
          return amountB - amountA;
        }
        return 0;
      });
      console.log('Sorted by Due Amount:', this.sortByDueAmount);
    }

    this.filteredBookings = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered bookings:', this.filteredBookings.length);
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
    this.paginatedBookings = this.filteredBookings.slice(startIndex, endIndex);
    
    console.log('Paginated bookings:', this.paginatedBookings.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    console.log('Current page:', this.currentPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onBuildingChange(): void {
    // Reset floor filter when building changes
    this.selectedFloor = '';
    
    // Update floor options based on selected building
    if (this.selectedBuilding) {
      const floorsInBuilding = this.enrichedBookings
        .filter(booking => booking.building?.id?.toString() === this.selectedBuilding)
        .map(booking => booking.floor)
        .filter((floor, index, self) => 
          floor && self.findIndex(f => f?.id === floor?.id) === index
        );
      this.floorOptions = [
        { id: '', name: 'All Floors' },
        ...floorsInBuilding.map(f => ({ id: f.id.toString(), name: f.name }))
      ];
    } else {
      // Show all floors if no building selected
      this.extractFilterOptions();
    }
    
    this.applyFilters();
  }

  onFloorChange(): void {
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
    this.selectedBuilding = '';
    this.selectedFloor = '';
    this.sortByDueAmount = '';
    this.currentPage = 1;
    this.extractFilterOptions(); // Reset floor options
    this.applyFilters();
  }

  viewBooking(id: number): void {
    this.router.navigate(['/viewbooking', id]);
  }

  editBooking(id: number): void {
    this.router.navigate(['/editbooking', id]);
  }

  deleteBooking(id: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          console.log('Booking deleted successfully');
          this.listAllBookings();
        },
        error: (err) => {
          console.error('Error deleting booking:', err);
          alert('Error deleting booking. Please try again.');
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

  getTotalDueAmount(): number {
    return this.filteredBookings.reduce((sum, booking) => sum + (booking.dueAmount || 0), 0);
  }

  getDueAmountClass(amount: number): string {
    if (amount === 0) return 'text-success';
    if (amount > 0 && amount < 10000) return 'text-warning';
    return 'text-danger';
  }
}