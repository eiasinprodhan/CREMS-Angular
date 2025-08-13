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
  id!: string;
  employee: Employee = new Employee();

  constructor(
    private employeeService: EmployeeService,
    private ar: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.loadEmployee();
  }

  // Load single employee by ID
  loadEmployee(): void {
    this.employeeService.viewEmployee(this.id).subscribe({
      next: (data) => {
        this.employee = data;
        this.cdr.markForCheck(); // optional if using OnPush strategy
      },
      error: (error) => {
        console.error('Failed to load employee:', error);
      },
    });
  }

  // Update employee
  updateEmployee(): void {
    this.employeeService.editEmployee(this.id, this.employee).subscribe({
      next: () => {
        this.router.navigate(['listemployees']);
      },
      error: (error) => {
        console.error('Failed to update employee:', error);
      },
    });
  }

  // Optional: for back navigation
  goBack(): void {
    this.router.navigate(['listemployees']);
  }
}
