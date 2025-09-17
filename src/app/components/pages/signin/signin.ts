import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.successMessage = 'Login successful!';
        this.errorMessage = null;

        const role = this.authService.getUserRole();

        if (role === 'ADMIN') {
          window.location.href = '/dashboard';
        } else if (role === 'PROJECT_MANAGER') {
          window.location.href = '/listprojects';
        } else if (role === 'SITE_MANAGER') {
          window.location.href = '/listbuildings';
        } else {
          window.location.href = '/signin';
        }
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.successMessage = null;
      }
    });
  }

}
