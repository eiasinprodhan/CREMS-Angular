import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StageService } from '../../../services/stage.service';
import { Stage } from '../../../models/stage.model';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Floor } from '../../../models/floor.model';
import { FloorService } from '../../../services/floor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-addstages',
  standalone: false,
  templateUrl: './addstages.html',
  styleUrl: './addstages.css',
})
export class Addstages implements OnInit {
  floorId!: number;
  addStageForm!: FormGroup;
  floor: Floor = new Floor();
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  labours$!: Observable<any[]>;

  constructor(
    private stageService: StageService,
    private floorService: FloorService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.floorId = +this.route.snapshot.params['id'];

    this.addStageForm = this.formBuilder.group({
      name: ['', Validators.required],
      startDate: [new Date().toISOString().slice(0, 10), Validators.required],
      endDate: ['', Validators.required],
      floor: [null],
      labours: [[], Validators.required],
    });

    this.viewLabours();
    this.getFloorById();
  }

  addStage(): void {
    if (this.addStageForm.invalid) {
      this.message = 'Please fill out all required fields.';
      this.messageType = 'danger';
      this.markAllFieldsAsTouched();
      return;
    }

    const formValue = this.addStageForm.value;

    const stage: Stage = {
      ...formValue,
      labours: formValue.labours,
      floor: this.floor,
    };

    this.stageService.addStages(stage).subscribe({
      next: () => {
        this.message = 'Stage Added Successfully.';
        this.messageType = 'success';
        this.addStageForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to add stage. Please try again.';
        this.messageType = 'danger';
      },
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.addStageForm.controls).forEach((field) => {
      const control = this.addStageForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  viewLabours(): void {
    this.labours$ = this.employeeService.viewEmployeeByRole('LABOUR');
  }

  getFloorById(): void {
    this.floorService.viewFloors(this.floorId).subscribe((data) => {
      this.floor = data;
      this.addStageForm.patchValue({ floor: data });
    });
  }
}
