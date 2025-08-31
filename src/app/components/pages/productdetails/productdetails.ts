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
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching units:', error);
      },
    });
  }
}
