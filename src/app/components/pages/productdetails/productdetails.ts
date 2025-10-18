import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UnitService } from '../../../services/unit.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-productdetails',
  standalone: false,
  templateUrl: './productdetails.html',
  styleUrl: './productdetails.css',
})
export class Productdetails implements OnInit {
  id!: number;
  units: any[] = [];
  filteredUnits: any[] = [];
  
  // Filter properties
  searchTerm: string = '';
  selectedStatus: string = 'all'; // all, available, booked
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private unitService: UnitService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = +this.ar.snapshot.params['id'];
    this.loadAllUnits();
  }

  loadAllUnits(): void {
    this.unitService.getUnitByBuildingId(this.id).subscribe({
      next: (data: any[]) => {
        console.log('Units loaded:', data);
        this.units = data.map(unit => ({
          ...unit,
          booked: unit.booked === true || unit.booked === 'true'
        }));
        this.filteredUnits = [...this.units];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching units:', error);
        this.units = [];
        this.filteredUnits = [];
      },
    });
  }

  applyFilters(): void {
    this.filteredUnits = this.units.filter(unit => {
      // Status filter
      const statusMatch = 
        this.selectedStatus === 'all' ||
        (this.selectedStatus === 'available' && !unit.booked) ||
        (this.selectedStatus === 'booked' && unit.booked);

      // Search filter
      const searchMatch = 
        this.searchTerm === '' ||
        unit.unitNumber?.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        unit.building?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        unit.floor?.name?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Price range filter
      const priceMatch = 
        (this.minPrice === null || unit.price >= this.minPrice) &&
        (this.maxPrice === null || unit.price <= this.maxPrice);

      return statusMatch && searchMatch && priceMatch;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onPriceChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.minPrice = null;
    this.maxPrice = null;
    this.filteredUnits = [...this.units];
  }

  getAvailableCount(): number {
    return this.units.filter(u => !u.booked).length;
  }

  getBookedCount(): number {
    return this.units.filter(u => u.booked).length;
  }

  getMinPrice(): number {
    if (this.units.length === 0) return 0;
    return Math.min(...this.units.map(u => u.price || 0));
  }

  getMaxPrice(): number {
    if (this.units.length === 0) return 0;
    return Math.max(...this.units.map(u => u.price || 0));
  }
}