import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signout',
  standalone: false,
  templateUrl: './signout.html',
  styleUrl: './signout.css'
})
export class Signout {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logout();
  }

  logout(): void {
    this.authService.logout();
    this.authService.removeEmployeeDetails();
    this.router.navigate(['/signin']);
  }
}
