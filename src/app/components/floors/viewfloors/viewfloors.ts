import { ChangeDetectorRef, Component } from '@angular/core';
import { Floor } from '../../../models/floor.model';
import { FloorService } from '../../../services/floor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewfloors',
  standalone: false,
  templateUrl: './viewfloors.html',
  styleUrl: './viewfloors.css'
})
export class Viewfloors {
  id!: string;
  floor: Floor = new Floor();

  constructor(
    private floorService: FloorService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.viewFloor();
  }

  viewFloor(): void {
    this.floorService.viewFloors(this.id).subscribe({
      next: (data) => {
        this.floor = data;
        console.log(data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching Floor:', error);
      }
    });
  }

  viewBuildings(id: string): void {
    this.router.navigate(['viewbuildings', id]);
  }
}
