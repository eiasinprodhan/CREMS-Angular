import { ChangeDetectorRef, Component } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listemployees',
  standalone: false,
  templateUrl: './listemployees.html',
  styleUrl: './listemployees.css'
})
export class Listemployees {
  employees!: any;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listEmployees();
  }

  // Get list of employees
  listEmployees(): void {
    this.employees = this.employeeService.listEmployees();
  }

  // View employee
  viewEmployee(id: number): void {
    this.router.navigate(['viewemployees', id]);
  }

  // Edit employee
  editEmployee(id: number): void {
    this.router.navigate(['editemployees', id]);
  }

  // Delete employee
  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.reattach();
        this.listEmployees();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  formatRole(role: string): string {
  return role
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }
}
