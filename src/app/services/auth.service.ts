import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse } from '../models/authresponse.model';
import { environments } from './environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environments.apiBaseUrl + '/auth';

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private userRoleSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  public userRole$: Observable<string | null> =
    this.userRoleSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        this.baseUrl + '/login',
        { email, password },
        { headers: this.headers }
      )
      .pipe(
        map((response: AuthResponse) => {
          if (this.isBrowser() && response.token) {
            localStorage.setItem('authToken', response.token);
            const decodeToken = this.decodeToken(response.token);
            localStorage.setItem('userRole', decodeToken.role);
            this.userRoleSubject.next(decodeToken.role);
            localStorage.setItem('userEmail', decodeToken.sub);
            this.userRoleSubject.next(decodeToken.sub);
          }
          return response;
        })
      );
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  decodeToken(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  getUserRole(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('userRole');
    }
    return null;
  }

  getUserEmail(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('userEmail');
    }
    return null;
  }

  isTokenExpired(token: string): boolean {
    const docodeToken = this.decodeToken(token);

    const expiry = docodeToken.exp * 1000;
    return Date.now() > expiry;
  }

  isLoggIn(): boolean {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      return true;
    }
    this.logout();
    return false;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('authToken');
      this.userRoleSubject.next(null);
    }
    this.router.navigate(['/login']);
  }

  hasRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isProjectManager(): boolean {
    return this.getUserRole() === 'PROJECT_MANAGER';
  }

  isSiteManager(): boolean {
    return this.getUserRole() === 'SITE_MANAGER';
  }
}
