import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Stage } from '../../../models/stage.model';
import { StageService } from '../../../services/stage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from '../../../services/floor.service';
import { Floor } from '../../../models/floor.model';
import { BuildingService } from '../../../services/building.service';
import { Building } from '../../../models/building.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-liststages',
  standalone: false,
  templateUrl: './liststages.html',
  styleUrl: './liststages.css'
})
export class Liststages implements OnInit {
  id!: number;
  buildings: Building[] = [];
  stages: Stage[] = [];
  filteredStages: Stage[] = [];
  paginatedStages: Stage[] = [];
  floor: Floor = new Floor();
  isLoading: boolean = false;

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID and Name
  sortByDaysLeft: string = ''; // 'asc', 'desc', or ''
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6; // Cards per page (2 rows of 3)
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Filter options
  sortOptions: any[] = [
    { value: '', label: 'No Sorting' },
    { value: 'asc', label: 'Days Left (Low to High)' },
    { value: 'desc', label: 'Days Left (High to Low)' }
  ];
  
  // Items per page options
  itemsPerPageOptions: number[] = [3, 6, 9, 12, 24];

  constructor(
    private stageService: StageService,
    private floorService: FloorService,
    private buildingService: BuildingService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log('Floor ID:', this.id);
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    console.log('Loading data...');

    forkJoin({
      stages: this.stageService.listStages(this.id),
      floor: this.floorService.viewFloors(this.id),
      buildings: this.buildingService.listBuildings()
    }).subscribe({
      next: (result) => {
        console.log('Data received:', result);
        this.stages = result.stages || [];
        this.floor = result.floor || new Floor();
        this.buildings = result.buildings || [];
        this.isLoading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
        this.applyFilters();
      }
    });
  }

  listStages(): void {
    this.stageService.listStages(this.id).subscribe({
      next: (data: Stage[]) => {
        this.stages = data || [];
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading stages:', error);
      }
    });
  }

  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Total stages:', this.stages.length);
    
    let filtered = [...this.stages];

    // Filter by ID or Name (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(stage => {
        const matchesId = stage.id.toString().includes(searchLower);
        const matchesName = stage.name.toLowerCase().includes(searchLower);
        return matchesId || matchesName;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    // Sort by Days Left
    if (this.sortByDaysLeft) {
      filtered.sort((a, b) => {
        const daysLeftA = this.getDaysLeft(a.endDate);
        const daysLeftB = this.getDaysLeft(b.endDate);
        
        if (this.sortByDaysLeft === 'asc') {
          return daysLeftA - daysLeftB;
        } else if (this.sortByDaysLeft === 'desc') {
          return daysLeftB - daysLeftA;
        }
        return 0;
      });
      console.log('Sorted by Days Left:', this.sortByDaysLeft);
    } else {
      // Default sort by start date (newest first)
      filtered.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    }

    this.filteredStages = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered stages:', this.filteredStages.length);
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
    this.paginatedStages = this.filteredStages.slice(startIndex, endIndex);
    
    console.log('Paginated stages:', this.paginatedStages.length);
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
    this.sortByDaysLeft = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  viewStage(id: number): void {
    this.router.navigate(['viewstages', id]);
  }

  editStage(id: number): void {
    this.router.navigate(['editstages', id]);
  }

  deleteStage(id: number): void {
    if (confirm('Are you sure you want to delete this stage?')) {
      this.stageService.deletestages(id).subscribe({
        next: () => {
          console.log('Stage deleted successfully');
          this.loadData();
        },
        error: (error) => {
          console.error('Delete error:', error);
          alert('Error deleting stage. Please try again.');
        }
      });
    }
  }

  getTimeStatus(stage: Stage): { text: string; className: string } {
    const now = new Date();
    const start = new Date(stage.startDate);
    const end = new Date(stage.endDate);

    if (now < start) {
      return { text: 'Upcoming', className: 'bg-primary' };
    } else if (now >= start && now <= end) {
      return { text: 'Ongoing', className: 'bg-warning' };
    } else {
      return { text: 'Completed', className: 'bg-success' };
    }
  }

  getDaysLeft(endDate: string | Date): number {
    const today = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - today.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }

  getBuildingName(id: number): string {
    const building = this.buildings.find((b) => b.id === id);
    return building ? building.name : 'Unknown';
  }

  getShowingText(): string {
    if (this.totalItems === 0) return 'Showing 0 to 0 of 0 entries';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }

  getUpcomingCount(): number {
    return this.stages.filter(s => this.getTimeStatus(s).text === 'Upcoming').length;
  }

  getOngoingCount(): number {
    return this.stages.filter(s => this.getTimeStatus(s).text === 'Ongoing').length;
  }

  getCompletedCount(): number {
    return this.stages.filter(s => this.getTimeStatus(s).text === 'Completed').length;
  }
}