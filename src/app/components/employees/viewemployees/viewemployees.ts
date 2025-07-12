import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewemployees',
  standalone: false,
  templateUrl: './viewemployees.html',
  styleUrl: './viewemployees.css'
})
export class Viewemployees implements OnInit{
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
    this.viewEmployee();
  }

  viewEmployee(): void {
    this.employeeService.viewEmployee(this.id).subscribe({
      next: (data) => {
        this.employee = data;
        console.log('Employee loaded:', data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching employee:', error);
      }
    });
  }

  viewBuilding(id: string): void {
    this.router.navigate(['viewbuildings', id]);
  }
}
