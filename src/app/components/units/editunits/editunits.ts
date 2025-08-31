import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Unit } from '../../../models/unit.model';
import { Floor } from '../../../models/floor.model';
import { Customer } from '../../../models/customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitService } from '../../../services/unit.service';
import { FloorService } from '../../../services/floor.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-editunits',
  standalone: false,
  templateUrl: './editunits.html',
  styleUrl: './editunits.css',
})
export class Editunits implements OnInit {
  id!: number;
  unit: Unit = new Unit();
  floors: Floor[] = [];
  customers: Customer[] = [];
  selectedPhotos: File[] = [];

  message: string = '';
  messageType: string = '';

  constructor(
    private ar: ActivatedRoute,
    private unitService: UnitService,
    private floorService: FloorService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = +this.ar.snapshot.params['id'];
    this.loadUnit();
    this.loadFloors();
    this.loadCustomers();
  }

  loadUnit(): void {
    this.unitService.viewUnit(this.id).subscribe({
      next: (data) => {
        // Deep clone to avoid binding issues
        this.unit = JSON.parse(JSON.stringify(data));
        this.unit.id = this.id;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load unit:', err);
        this.message = 'Failed to load unit.';
        this.messageType = 'danger';
      },
    });
  }

  loadFloors(): void {
    this.floorService.listFloors().subscribe({
      next: (data) => (this.floors = data),
      error: (err) => console.error('Failed to load floors:', err),
    });
  }

  loadCustomers(): void {
    this.customerService.listCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load customers:', err),
    });
  }

  onPhotosSelected(event: any): void {
    this.selectedPhotos = Array.from(event.target.files);
  }

  updateUnit(): void {
    console.log('Updating unit:', this.unit.unitNumber); // Debug current value
    this.unitService.editUnit(this.unit, this.selectedPhotos).subscribe({
      next: () => {
        this.message = 'Unit updated successfully!';
        this.messageType = 'success';
        this.router.navigate(['/listunits']);
      },
      error: (err) => {
        console.error('Failed to update unit:', err);
        this.message = 'Failed to update unit.';
        this.messageType = 'danger';
      },
    });
  }
}
