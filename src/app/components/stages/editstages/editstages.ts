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
  id!: string;
  stage: Stage = new Stage();
  labours!: any[];

  constructor(
    private stageService: StageService,
    private employeeService: EmployeeService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.viewLabours();
  }

  // Load labours
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

  // View Stage by ID
  viewStage(): void {
    this.stageService.viewStages(this.id).subscribe({
      next: (data) => {
        this.stage = data;
        console.log('Stage loaded:', this.stage);
        
        // Set previously selected labours based on the stage data
        this.setLabourSelection();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log('Error loading stage:', error);
      }
    });
  }

  // Set previously selected labours based on stage data
  setLabourSelection(): void {
    if (this.labours && this.stage.labours) {
      this.labours.forEach(labour => {
        labour.selected = this.stage.labours.includes(labour.id);
      });
      console.log('Labours after selection:', this.labours);
    }
  }

  // Update Stage
  updateStage(): void {
    const selectedLabours = this.labours
      .filter(labour => labour.selected)
      .map(labour => labour.id);
    this.stage.labours = selectedLabours;
    this.stageService.editStages(this.id, this.stage).subscribe({
      next: (res) => {
        console.log('Stage updated:', res);
        this.router.navigate(['liststages', this.stage.floor]);
      },
      error: (error) => {
        console.log('Error updating stage:', error);
      }
    });
  }
}
