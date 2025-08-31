import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App {
  protected title = 'CREM-Angular';
  showHeader = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/', '/signin', '/signup', '/products'];

        // Add dynamic check for product details
        const isProductDetails = event.url.startsWith('/productdetails/');

        this.showHeader = !(
          hiddenRoutes.includes(event.url) || isProductDetails
        );
      }
    });


  }

}
