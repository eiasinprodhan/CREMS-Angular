import { ChangeDetectorRef, Component } from '@angular/core';
import { Stage } from '../../../models/stage.model';
import { StageService } from '../../../services/stage.service';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editstages',
  standalone: false,
  templateUrl: './editstages.html',
  styleUrl: './editstages.css',
})
export class Editstages {
  id!: number;
  stage: Stage = new Stage();
  labours!: any[];

  constructor(
    private stageService: StageService,
    private employeeService: EmployeeService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.viewLabours();
  }

  viewLabours(): void {
    this.employeeService.viewEmployeeByRoles("Labour").subscribe({
      next: (data) => {
        this.labours = data;
        console.log('Labours loaded:', this.labours);
        this.viewStage();
      },
      error: (error) => {
        console.log('Error loading labours:', error);
      }
    });
  }


  viewStage(): void {
    this.stageService.viewStages(this.id).subscribe({
      next: (data) => {
        data.endDate = this.formatDate(data.endDate);
        this.stage = data;
        console.log('Stage loaded:', this.stage);

        this.setLabourSelection();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log('Error loading stage:', error);
      }
    });
  }

  setLabourSelection(): void {
    if (this.labours && this.stage.labours) {
      this.labours.forEach(labour => {
        labour.selected = this.stage.labours.includes(labour.id);
      });
      console.log('Labours after selection:', this.labours);
    }
  }

  updateStage(): void {
    const selectedLabours = this.labours
      .filter(labour => labour.selected)
      .map(labour => labour.id);
    this.stage.labours = selectedLabours;
    this.stageService.editStages(this.stage).subscribe({
      next: (res) => {
        console.log('Stage updated:', res);
        this.router.navigate(['liststages', this.stage.floor.id]);
      },
      error: (error) => {
        console.log('Error updating stage:', error);
      }
    });
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
