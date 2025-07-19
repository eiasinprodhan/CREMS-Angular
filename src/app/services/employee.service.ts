import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  baseUrl: string = 'http://localhost:3000/employees';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Create new employee
  addEmployee(employee: Employee): Observable<any> {
    return this.http.post(this.baseUrl, employee);
  }

  // Get all employees
  listEmployees(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Get single employee
  viewEmployee(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Update employee
  editEmployee(id: string, employee: Employee): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, employee);
  }

  // Delete employee
  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Search employee by role
  viewEmployeeByRole(role: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?role=${role}`);
  }

  viewEmployeeByRoles(role: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}?role=${role}`);
  }


  //Update employee status
  editEmployeeStatus(id: string, status: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, status);
  }

  // update empployee totalsalary And 
  updateTotalSalary(id: string, salary: number): Observable<any>{
    return this.http.patch(this.baseUrl+"/"+id, {salary: salary});
  }
  
  getEmployeeProfile(): Observable<Employee | null> {
    return of(this.authService.getEmployeeProfileFromStorage());
  }

  updateEmployeeProfile(employee: Employee): Observable<Employee> {
    localStorage.setItem('userProfile', JSON.stringify(employee));
    return this.http.put<Employee>(`${this.baseUrl}/${employee.id}`, employee);
  }
}
