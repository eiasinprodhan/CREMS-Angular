import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Employee } from '../models/employee.model';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { environments } from './environments';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  baseUrl: string = environments.apiBaseUrl + '/employees';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  addEmployee(user: User, employee: Employee, file: File): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    const formData = new FormData();
    formData.append('user', JSON.stringify(user));
    formData.append('employee', JSON.stringify(employee));
    formData.append('photo', file);

    return this.http.post(this.baseUrl + '/', formData, { headers });
  }

  // Get all employees
  listEmployees(): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get(this.baseUrl + '/', { headers });
  }

  // Get single employee
  viewEmployee(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  // Update employee
  editEmployee(employee: Employee, file: File): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    const formData = new FormData();
    formData.append('employee', JSON.stringify(employee));
    formData.append('photo', file);
    return this.http.put(this.baseUrl + '/', formData, { headers });
  }

  // Delete employee
  deleteEmployee(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  // Search employee by role
  viewEmployeeByRole(role: string): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get(`${this.baseUrl}?role=${role}`, { headers });
  }

  viewEmployeeByRoles(role: string): Observable<Employee[]> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get<Employee[]>(`${this.baseUrl}?role=${role}`, { headers });
  }

  //Update employee status
  editEmployeeStatus(id: number, status: boolean): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.put(`${this.baseUrl}/${id}`, status, { headers });
  }

  // update empployee totalsalary And
  updateTotalSalary(id: number, salary: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.patch(this.baseUrl + '/' + id, { salary: salary }, { headers });
  }

  updateEmployeeProfile(employee: Employee): Observable<Employee> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    localStorage.setItem('userProfile', JSON.stringify(employee));
    return this.http.put<Employee>(`${this.baseUrl}/${employee.id}`, employee, { headers });
  }
}
