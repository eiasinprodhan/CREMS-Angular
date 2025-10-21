import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listcustomers',
  standalone: false,
  templateUrl: './listcustomers.html',
  styleUrl: './listcustomers.css'
})
export class Listcustomers implements OnInit {
  customers: any[] = [];
  filteredCustomers: any[] = [];
  paginatedCustomers: any[] = [];
  isLoading: boolean = false;

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID, Name, Email, Phone
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Items per page options
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.listCustomers();
  }

  listCustomers(): void {
    this.isLoading = true;
    console.log('Fetching customers...');
    
    this.customerService.listCustomers().subscribe({
      next: (data) => {
        console.log('Customers received:', data);
        this.customers = data || [];
        this.isLoading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching customers:', error);
        this.isLoading = false;
        this.customers = [];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Total customers:', this.customers.length);
    
    let filtered = [...this.customers];

    // Filter by ID, Name, Email, or Phone (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(customer => {
        const matchesId = customer.id.toString().includes(searchLower);
        const matchesName = customer.name?.toLowerCase().includes(searchLower) || false;
        const matchesEmail = customer.email?.toLowerCase().includes(searchLower) || false;
        const matchesPhone = customer.phone?.includes(searchLower) || false;
        return matchesId || matchesName || matchesEmail || matchesPhone;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    this.filteredCustomers = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered customers:', this.filteredCustomers.length);
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
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
    
    console.log('Paginated customers:', this.paginatedCustomers.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    console.log('Current page:', this.currentPage);
  }

  onSearchChange(): void {
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
    this.currentPage = 1;
    this.applyFilters();
  }

  viewCustomer(id: number): void {
    this.router.navigate(['viewcustomers', id]);
  }

  editCustomer(id: number): void {
    this.router.navigate(['editcustomers', id]);
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomers(id).subscribe({
        next: () => {
          console.log('Customer deleted successfully', id);
          this.listCustomers();
        },
        error: (err) => {
          console.error('Delete error', err);
          alert('Error deleting customer. Please try again.');
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
}