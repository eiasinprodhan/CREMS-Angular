import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuildingService } from '../../../services/building.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  buildings: any[] = [];
  filteredBuildings: any[] = [];
  
  // Filter properties
  searchTerm: string = '';
  selectedType: string = 'all';
  buildingTypes: string[] = [];

  constructor(
    private buildingService: BuildingService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllBuilding();
  }

  loadAllBuilding(): void {
    this.buildingService.listBuildings().subscribe({
      next: (data: any[]) => {
        this.buildings = data;
        this.filteredBuildings = [...this.buildings];
        this.extractFilters();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading buildings:', error);
        this.buildings = [];
        this.filteredBuildings = [];
      }
    });
  }

  extractFilters(): void {
    // Extract unique building types
    const typeSet = new Set(this.buildings.map(b => b.type).filter(t => t));
    this.buildingTypes = Array.from(typeSet);
  }

  applyFilters(): void {
    this.filteredBuildings = this.buildings.filter(building => {
      // Type filter
      const typeMatch = 
        this.selectedType === 'all' ||
        building.type?.toLowerCase() === this.selectedType.toLowerCase();

      // Search filter (name and location)
      const searchMatch = 
        this.searchTerm === '' ||
        building.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        building.location?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        building.type?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return typeMatch && searchMatch;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedType = 'all';
    this.filteredBuildings = [...this.buildings];
  }

  productDetails(id: number): void {
    this.router.navigate(['productdetails', id]);
  }

  getTotalUnits(): number {
    return this.buildings.reduce((sum, b) => sum + (b.unitCount || 0), 0);
  }

  getUniqueLocations(): number {
    const locations = new Set(this.buildings.map(b => b.location).filter(l => l));
    return locations.size;
  }
}