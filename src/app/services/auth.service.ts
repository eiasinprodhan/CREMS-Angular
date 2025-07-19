import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse } from '../models/authresponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "http://localhost:3000/employees";

  private currentEmployeeSubject: BehaviorSubject<Employee | null>;
  private currentEmployee$: Observable<Employee | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const storedEmployee = this.isBrowser() ? JSON.parse(localStorage.getItem('currentEmployee') || 'null') : null;
    this.currentEmployeeSubject = new BehaviorSubject<Employee | null>(storedEmployee);
    this.currentEmployee$ = this.currentEmployeeSubject.asObservable();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  registration(employee: Employee): Observable<AuthResponse> {
    return this.http.post<Employee>(this.baseUrl, Employee).pipe(
      map((newEmployee: Employee) => {
        const token = btoa(`${newEmployee.email}${newEmployee.password}`);
        return { token, employee: newEmployee } as AuthResponse;
      }),
      catchError(error => {
        console.log(error);
        throw error;
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
  let params = new HttpParams().append('email', credentials.email);

  return this.http.get<Employee[]>(`${this.baseUrl}`, { params }).pipe(
    map(employees => { // Changed 'employee' to 'employees'
      if (employees.length > 0) {
        const employee = employees[0]; // Changed 'Employee[0]' to 'employees[0]'
        if (employee.password === credentials.password) {
          const token = btoa(`${employee.email}:${employee.password}`);
          this.storeToken(token);
          this.setCurrentEmployee(employee);
          return { token, employee } as AuthResponse;
        } else {
          throw new Error("Wrong password.");
        }
      } else {
        throw new Error("Employee not found.");
      }
    }),
    catchError(error => {
      console.log(error);
      throw error;
    })
  );
}

  public get currentEmployeeValue(): Employee | null {
    return this.currentEmployeeSubject.value;
  }

  logout(): void {
    this.clearCurrentEmployee();
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }

  private setCurrentEmployee(Employee: Employee): void {
    if (this.isBrowser()) {
      localStorage.setItem('currentEmployee', JSON.stringify(Employee));
    }
    this.currentEmployeeSubject.next(Employee);
  }

  private clearCurrentEmployee(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('currentEmployee');
    }
    this.currentEmployeeSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  getEmployeeRole(): any {
    return this.currentEmployeeValue?.role;
  }

  storeToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  storeEmployeeProfile(Employee: Employee): void {
    if (this.isBrowser()) {
      localStorage.setItem('currentEmployee', JSON.stringify(Employee));
    }
  }

  getEmployeeProfileFromStorage(): Employee | null {
    if (this.isBrowser()) {
      const EmployeeProfile = localStorage.getItem('currentEmployee');
      console.log('Employee Profile is: ', EmployeeProfile);
      return EmployeeProfile ? JSON.parse(EmployeeProfile) : null;
    }
    return null;
  }

  removeEmployeeDetails(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
  }
}
