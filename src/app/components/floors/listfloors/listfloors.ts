import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FloorService } from '../../../services/floor.service';
import { Router } from '@angular/router';
import { BuildingService } from '../../../services/building.service';
import { Building } from '../../../models/building.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listfloors',
  standalone: false,
  templateUrl: './listfloors.html',
  styleUrl: './listfloors.css',
})
export class Listfloors implements OnInit {
  floors: any[] = [];
  filteredFloors: any[] = [];
  paginatedFloors: any[] = [];
  buildings: Building[] = [];
  isLoading: boolean = false;

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID and Name
  selectedBuilding: string = '';
  selectedStatus: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Filter options
  buildingOptions: any[] = [{ id: '', name: 'All Buildings' }];
  statusOptions: string[] = ['All', 'Complete', 'Ongoing'];
  
  // Items per page options
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private floorService: FloorService,
    private buildingService: BuildingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    console.log('Fetching floors and buildings...');
    
    // Load both floors and buildings simultaneously
    forkJoin({
      floors: this.floorService.listFloors(),
      buildings: this.buildingService.listBuildings()
    }).subscribe({
      next: (result) => {
        console.log('Data received:', result);
        this.floors = result.floors || [];
        this.buildings = result.buildings || [];
        this.isLoading = false;
        this.populateBuildingOptions();
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
        this.floors = [];
        this.buildings = [];
        this.applyFilters();
      }
    });
  }

  listFloors(): void {
    this.isLoading = true;
    this.floorService.listFloors().subscribe({
      next: (data) => {
        console.log('Floors received:', data);
        this.floors = data || [];
        this.isLoading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching floors:', error);
        this.isLoading = false;
        this.floors = [];
        this.applyFilters();
      }
    });
  }

  populateBuildingOptions(): void {
    this.buildingOptions = [
      { id: '', name: 'All Buildings' },
      ...this.buildings.map(b => ({ id: b.id.toString(), name: b.name }))
    ];
    console.log('Building options:', this.buildingOptions);
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Total floors:', this.floors.length);
    
    let filtered = [...this.floors];

    // Filter by ID or Name (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(floor => {
        const matchesId = floor.id.toString().includes(searchLower);
        const matchesName = floor.name.toLowerCase().includes(searchLower);
        return matchesId || matchesName;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    // Filter by Building
    if (this.selectedBuilding && this.selectedBuilding !== '') {
      filtered = filtered.filter(floor => 
        floor.building.id.toString() === this.selectedBuilding
      );
      console.log('Filtered by Building:', filtered.length);
    }

    // Filter by Status
    if (this.selectedStatus && this.selectedStatus !== 'All' && this.selectedStatus !== '') {
      filtered = filtered.filter(floor => {
        const isComplete = this.isComplete(floor.expectedEndDate);
        const status = isComplete ? 'Complete' : 'Ongoing';
        return status === this.selectedStatus;
      });
      console.log('Filtered by Status:', filtered.length);
    }

    this.filteredFloors = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered floors:', this.filteredFloors.length);
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
    this.paginatedFloors = this.filteredFloors.slice(startIndex, endIndex);
    
    console.log('Paginated floors:', this.paginatedFloors.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    console.log('Current page:', this.currentPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onBuildingChange(): void {
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
    this.selectedBuilding = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  getBuildingName(id: number): string {
    const building = this.buildings.find((b) => b.id === id);
    return building ? building.name : 'Unknown';
  }

  viewFloors(id: number): void {
    this.router.navigate(['viewfloors', id]);
  }

  editFloors(id: number): void {
    this.router.navigate(['editfloors', id]);
  }

  deleteFloors(id: number): void {
    if (confirm('Are you sure you want to delete this floor?')) {
      this.floorService.deleteFloors(id).subscribe({
        next: (res) => {
          console.log('Floor deleted successfully', res);
          this.loadData();
        },
        error: (error) => {
          console.error('Error deleting floor:', error);
          alert('Error deleting floor. Please try again.');
        }
      });
    }
  }

  // Returns true if the floor is completed
  isComplete(expectedEndDate: Date | string): boolean {
    const today = new Date();
    const expected = new Date(expectedEndDate);
    return expected <= today;
  }

  // Returns a human-readable time left
  getTimeLeft(expectedEndDate: Date | string): string {
    const today = new Date();
    const endDate = new Date(expectedEndDate);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day(s) left`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return 'Past due';
    }
  }

  getStatusClass(expectedEndDate: Date | string): string {
    return this.isComplete(expectedEndDate) ? 'bg-success' : 'bg-warning';
  }

  getShowingText(): string {
    if (this.totalItems === 0) return 'Showing 0 to 0 of 0 entries';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }
}