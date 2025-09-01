import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editemployees',
  standalone: false,
  templateUrl: './editemployees.html',
  styleUrl: './editemployees.css'
})
export class Editemployees implements OnInit {
  id!: number;
  employee: Employee = new Employee();
  photoFile!: File;
  currentEmployee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.loadEmployee();
    this.loadUserProfile(); // Added call to load current employee role
  }

  loadEmployee(): void {
    this.employeeService.viewEmployee(this.id).subscribe({
      next: (data) => {
        this.employee = data;
        this.cdr.markForCheck(); // Optional: Only needed if using OnPush change detection
      },
      error: (error) => {
        console.error('Failed to load employee:', error);
      },
    });
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
    }
  }

  updateEmployee(): void {
    this.employeeService.editEmployee(this.employee, this.photoFile).subscribe({
      next: () => {
        const role = this.currentEmployee?.role;

        if (role === 'Admin') {
          this.router.navigate(['listemployees']);
        } else if (role === 'Project Manager' || role === 'Site Manager') {
          this.router.navigate(['/signout']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Failed to update employee:', error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['listemployees']);
  }

  loadUserProfile(): void {
    this.employeeService.getEmployeeProfile().subscribe({
      next: (res) => {
        if (res) {
          this.currentEmployee = res;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
      },
    });
  }
}
