import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse } from '../models/authresponse.model';
import { environments } from './environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environments.apiBaseUrl + '/employees';

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
  const params = new HttpParams()
    .set('email', credentials.email)
    .set('password', credentials.password);

  return this.http.get<Employee>(`${this.baseUrl}/login`, { params }).pipe(
    map(employee => {
      if (employee) {
        // Simulate token generation (Base64 of email:password)
        const token = btoa(`${employee.email}:${credentials.password}`);
        this.storeToken(token);
        this.setCurrentEmployee(employee);
        return { token, employee } as AuthResponse;
      } else {
        throw new Error('Login failed: No employee returned.');
      }
    }),
    catchError(error => {
      console.error('Login error:', error);
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
