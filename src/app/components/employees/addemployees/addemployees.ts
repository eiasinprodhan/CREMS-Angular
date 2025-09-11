import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-addemployees',
  standalone: false,
  templateUrl: './addemployees.html',
  styleUrl: './addemployees.css',
})
export class Addemployees implements OnInit {
  addUserForm!: FormGroup;
  addEmployeeForm!: FormGroup;
  photoFile!: File;

  message: string = '';
  messageType: string = '';

  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.addEmployeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      nid: [null, [Validators.required]],
      joiningDate: ['', Validators.required],
      role: ['', Validators.required],
      salaryType: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(1)]],
      status: [false],
      country: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  addEmployee(): void {
    if (this.addEmployeeForm.invalid) {
      this.addEmployeeForm.markAllAsTouched();
      return;
    }

    const user: User = {
      name: this.addEmployeeForm.value.name,
      email: this.addEmployeeForm.value.email,
      phone: this.addEmployeeForm.value.phone,
      password: this.addEmployeeForm.value.password,
      role: this.addEmployeeForm.value.role,
    };

    this.employeeService
      .addEmployee(user, this.addEmployeeForm.value, this.photoFile)
      .subscribe({
        next: () => {
          this.message = 'Employee added successfully!';
          this.messageType = 'success';
          this.addEmployeeForm.reset();
        },
        error: (err) => {
          this.message = 'Failed to add employee. Please try again.';
          this.messageType = 'danger';
          console.error(err);
        },
      });
  }

  onPhotoSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.photoFile = event.target.files[0];
      console.log('Selected file:', this.photoFile);
    }
  }
}
