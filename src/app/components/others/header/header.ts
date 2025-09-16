import { ChangeDetectorRef, Component } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  employee: Employee | null = null;
  role!: string | null;
  email!: string | null;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.role = this.authService.getUserRole();
    this.email = this.authService.getUserEmail();
    this.employeeService.viewEmployeeProfileByEmail(this.email).subscribe(data=>{
      this.employee = data;
      this.cdr.detectChanges();
    });
  }
}
