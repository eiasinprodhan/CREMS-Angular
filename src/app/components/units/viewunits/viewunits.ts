import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Unit } from '../../../models/unit.model';
import { Customer } from '../../../models/customer.model';
import { Floor } from '../../../models/floor.model';
import { Building } from '../../../models/building.model';
import { UnitService } from '../../../services/unit.service';
import { CustomerService } from '../../../services/customer.service';
import { FloorService } from '../../../services/floor.service';
import { BuildingService } from '../../../services/building.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewunits',
  standalone: false,
  templateUrl: './viewunits.html',
  styleUrl: './viewunits.css'
})
export class Viewunits implements OnInit{
  id!: number;
  unit: any = {};
  building: any = {};
  floor: any = {};
  isModalOpen: boolean = false;
  currentIndex: number = 0;

  constructor(
    private unitService: UnitService,
    private floorService: FloorService,
    private buildingService: BuildingService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.loadUnit();
  }

  loadUnit(): void {
    this.unitService.viewUnit(this.id).subscribe({
      next: (data) => {
        this.unit = data;
        if (this.unit.buildingId) {
          this.loadBuilding(this.unit.buildingId);
        }
        if (this.unit.floorId) {
          this.loadFloor(this.unit.floorId);
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading unit:', error);
      }
    });
  }

  loadBuilding(id: number): void {
    this.buildingService.viewBuildings(id).subscribe({
      next: (data) => {
        this.building = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading building:', error);
      }
    });
  }

  loadFloor(id: number): void {
    this.floorService.viewFloors(id).subscribe({
      next: (data) => {
        this.floor = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading floor:', error);
      }
    });
  }

  openFullScreenModal(index: number): void {
    this.isModalOpen = true;
    this.currentIndex = index;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  nextImage(): void {
    if (this.currentIndex < this.unit.photoUrls.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;  // Loop back to the first image
    }
  }

  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.unit.photoUrls.length - 1;  // Loop back to the last image
    }
  }
  
}
