import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected title = 'CREM-Angular';
  showNavbar = true;

  constructor(private router: Router) {
    // Listen to router events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // List of routes where navbar should be hidden
        const hiddenRoutes = ['/', '/signin', '/signup'];

        this.showNavbar = !hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }
}
