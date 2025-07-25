import { ChangeDetectorRef, Component } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  employee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const sub = this.employeeService.getEmployeeProfile().subscribe({
      next: (res) => {
        if (res) {
          this.employee = res;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
      },
    });
  }
}
