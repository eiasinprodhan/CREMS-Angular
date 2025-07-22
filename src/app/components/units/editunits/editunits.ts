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
  styleUrl: './editunits.css'
})
export class Editunits implements OnInit{
  id!: string;
  unit: Unit = new Unit();
  floors: Floor[] = [];
  customers: Customer[] = [];

  message: string = '';
  messageType: string = '';

  constructor(
    private ar: ActivatedRoute,
    private unitService: UnitService,
    private floorService: FloorService,
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load unit:', err);
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
      }
    });
  }
}
