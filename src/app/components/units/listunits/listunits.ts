import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../../../models/unit.model';
import { UnitService } from '../../../services/unit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listunits',
  standalone: false,
  templateUrl: './listunits.html',
  styleUrl: './listunits.css'
})
export class Listunits implements OnInit{
  units!: Observable<Unit[]>;

  constructor(
    private unitService: UnitService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listUnits();
  }

  // List Units
  listUnits(): void {
    this.units = this.unitService.listUnits();
  }

  // Book Unit
  bookUnit(id: string): void {
    this.router.navigate(['bookunit', id]);
  }


  // View Unit
  viewUnit(id: string): void {
    this.router.navigate(['viewunits', id]);
  }

  // Edit Unit
  editUnit(id: string): void {
    this.router.navigate(['editunits', id]);
  }

  // Delete Unit
  deleteUnit(id: string): void {
    this.unitService.deleteUnit(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.reattach(); // optional, depends on how change detection is working in your app
        this.listUnits();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
