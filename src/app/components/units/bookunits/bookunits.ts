import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Unit } from '../../../models/unit.model';
import { Floor } from '../../../models/floor.model';
import { Customer } from '../../../models/customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from '../../../services/floor.service';
import { CustomerService } from '../../../services/customer.service';
import { UnitService } from '../../../services/unit.service';
import { Building } from '../../../models/building.model';
import { BuildingService } from '../../../services/building.service';

@Component({
  selector: 'app-bookunits',
  standalone: false,
  templateUrl: './bookunits.html',
  styleUrl: './bookunits.css',
})
export class Bookunits implements OnInit {
  id!: string;
  unit: Unit = new Unit();
  floor: Floor = new Floor();
  building: Building = new Building();
  floors: Floor[] = [];
  customers: Customer[] = [];

  message: string = '';
  messageType: string = '';

  constructor(
    private ar: ActivatedRoute,
    private unitService: UnitService,
    private floorService: FloorService,
    private buildingService: BuildingService,
    private customerService: CustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.loadUnit();
    this.loadFloors();
    this.loadCustomers();
  }

  loadUnit(): void {
    this.unitService.viewUnit(this.id).subscribe({
      next: (data) => {
        this.unit = data;

        if (this.unit.floorId) {
          this.loadFloor(this.unit.floorId);
        }

        if (this.unit.buildingId) {
          this.loadBuilding(this.unit.buildingId);
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load unit:', err);
      }
    });
  }

  loadFloor(id: string): void {
    this.floorService.viewFloors(id).subscribe({
      next: (data) => {
        this.floor = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load floor:', err);
      }
    });
  }

  loadBuilding(id: string): void {
    this.buildingService.viewBuildings(id).subscribe({
      next: (data) => {
        this.building = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load building:', err);
      }
    });
  }

  loadFloors(): void {
    this.floorService.listFloors().subscribe({
      next: (data) => {
        this.floors = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load floors:', err);
      }
    });
  }

  loadCustomers(): void {
    this.customerService.listCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load customers:', err);
      }
    });
  }

  updateUnit(): void {
    this.unitService.editUnit(this.id, this.unit).subscribe({
      next: () => {
        this.message = 'Unit updated successfully!';
        this.messageType = 'success';
        this.router.navigate(['/listunits']);
      },
      error: (err) => {
        console.error('Failed to update unit:', err);
        this.message = 'Error updating unit.';
        this.messageType = 'error';
      }
    });
  }
}
