import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Stage } from '../../../models/stage.model';
import { StageService } from '../../../services/stage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from '../../../services/floor.service';
import { Floor } from '../../../models/floor.model';
import { BuildingService } from '../../../services/building.service';
import { Building } from '../../../models/building.model';

@Component({
  selector: 'app-liststages',
  standalone: false,
  templateUrl: './liststages.html',
  styleUrl: './liststages.css'
})
export class Liststages implements OnInit {
  id!: string;
  buildings: Building[] = [];
  stages: Stage[] = [];
  floor: Floor = new Floor();

  constructor(
    private stageService: StageService,
    private floorService: FloorService,
    private buildingService: BuildingService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadData();
  }

  private loadData(): void {
    this.listStages();
    this.viewFloorById();
    this.listBuildings();
  }

  listStages(): void {
    this.stageService.listStages(this.id).subscribe({
      next: (data: Stage[]) => {
        this.stages = data.sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading stages:', error);
      }
    });
  }

  viewFloorById(): void {
    this.floorService.viewFloors(this.id).subscribe({
      next: (data: Floor) => {
        this.floor = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading floor:', error);
      }
    });
  }

  listBuildings(): void {
    this.buildingService.listBuildings().subscribe({
      next: (data: Building[]) => {
        this.buildings = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading buildings:', error);
      }
    });
  }

  viewStage(id: string): void {
    this.router.navigate(['viewstages', id]);
  }

  editStage(id: string): void {
    this.router.navigate(['editstages', id]);
  }

  deleteStage(id: string): void {
    this.stageService.deletestages(id).subscribe({
      next: () => {
        this.listStages();
      },
      error: (error) => {
        console.error('Delete error:', error);
      }
    });
  }

  getTimeStatus(stage: Stage): { text: string; className: string } {
    const now = new Date();
    const start = new Date(stage.startDate);
    const end = new Date(stage.endDate);

    if (now < start) {
      return { text: 'Upcoming', className: 'bg-primary' };
    } else if (now >= start && now <= end) {
      return { text: 'Ongoing', className: 'bg-warning' };
    } else {
      return { text: 'Completed', className: 'bg-success' };
    }
  }

  getDaysLeft(endDate: string | Date): number {
    const today = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - today.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }

  getBuildingName(id: string): string {
    const building = this.buildings.find((b) => b.id === id);
    return building ? building.name : 'Unknown';
  }


}
