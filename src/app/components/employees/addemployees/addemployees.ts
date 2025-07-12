import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-addemployees',
  standalone: false,
  templateUrl: './addemployees.html',
  styleUrl: './addemployees.css'
})
export class Addemployees implements OnInit {
  addEmployeeForm!: FormGroup;

  message: string = '';
  messageType: string = '';

  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.addEmployeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      nid: [null, [Validators.required]],
      joiningDate: ['', Validators.required],
      role: ['', Validators.required],
      salarytype: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(1)]],
      status: [false],
      photo: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  addEmployee(): void {
    if (this.addEmployeeForm.invalid) {
      this.addEmployeeForm.markAllAsTouched();
      return;
    }

    this.employeeService.addEmployee(this.addEmployeeForm.value).subscribe({
      next: () => {
        this.message = 'Employee added successfully!';
        this.messageType = 'success';
        this.addEmployeeForm.reset();
      },
      error: (err) => {
        this.message = 'Failed to add employee. Please try again.';
        this.messageType = 'danger';
        console.error(err);
      }
    });
  }
}
