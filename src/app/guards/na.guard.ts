import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import e from 'express';


@Injectable({
    providedIn: 'root'
})
export class NotAuthenticatedGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> {
        if (this.authService.isAdmin()) {
            return this.router.createUrlTree(['/dashboard']);
        } else if (this.authService.isProjectManager()) {
            return this.router.createUrlTree(['/listprojects']);
        } else if (this.authService.isSiteManager()) {
            return this.router.createUrlTree(['/listprojects']);
        } else {
            return true;
        }
    }

}
