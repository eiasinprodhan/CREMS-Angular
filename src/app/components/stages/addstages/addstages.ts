import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StageService } from '../../../services/stage.service';
import { Stage } from '../../../models/stage.model';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-addstages',
  standalone: false,
  templateUrl: './addstages.html',
  styleUrl: './addstages.css'
})
export class Addstages implements OnInit {
  addStageForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  labours!: any;

  constructor(
    private stageService: StageService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.addStageForm = this.formBuilder.group({
      name: ['', Validators.required],
      startDate: [new Date().toISOString().slice(0, 10), Validators.required],
      endDate: ['', Validators.required],
      floor: [''],
      labours: [[]],
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.addStageForm.patchValue({ floor: params['id'] });
      }
    });

    this.viewLabours();

  }


  addStage(): void {
    if (this.addStageForm.invalid) {
      this.message = 'Please fill out all required fields.';
      this.messageType = 'danger';
      this.markAllFieldsAsTouched();
      return;
    }

    const stage: Stage = {
      ...this.addStageForm.value
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
    this.labours = this.employeeService.viewEmployeeByRole("Labour");
  }
}
