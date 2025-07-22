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
  id!: string;
  unit: Unit = new Unit();
  customer: Customer = new Customer();
  floor: Floor = new Floor();
  building: Building = new Building();

  constructor(
    private unitService: UnitService,
    private customerService: CustomerService,
    private floorService: FloorService,
    private buildingService: BuildingService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.loadUnit();
  }

  loadUnit(): void {
    this.unitService.viewUnit(this.id).subscribe({
      next: (data) => {
        this.unit = data;

        if (this.unit.customerId) {
          this.loadCustomer(this.unit.customerId);
        }

        if (this.unit.floorId) {
          this.loadFloor(this.unit.floorId);
        }

        if (this.unit.buildingId) {
          this.loadBuilding(this.unit.buildingId);
        }

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading unit:', error);
      }
    });
  }

  loadCustomer(id: string): void {
    this.customerService.viewCustomers(id).subscribe({
      next: (data) => {
        this.customer = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading customer:', error);
      }
    });
  }

  loadFloor(id: string): void {
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

  loadBuilding(id: string): void {
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

  getBookingClass(isBooked: boolean): string {
    return isBooked ? 'bg-success' : 'bg-secondary';
  }
  
}
