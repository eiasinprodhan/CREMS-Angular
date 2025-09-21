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
  link!:string;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    if(this.role==='ADMIN'){
      this.link = '/dashboard'
    }else if(this.role==='PROJECT_MANAGER'){
      this.link = '/listprojects'
    }else if(this.role==='SITE_MANAGER'){
      this.link = '/listbuildings'
    }else{
      this.link = '/'
    }
  }

  loadUserProfile(): void {
    this.role = this.authService.getUserRole();
    this.email = this.authService.getUserEmail();
    this.employeeService.viewEmployeeProfileByEmail(this.email).subscribe(data=>{
      this.employee = data;
      this.cdr.detectChanges();
    });
  }

  formatRole(role: string | null): string {
    if (!role) return '';
    return role
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    }
  
}
