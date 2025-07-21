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
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please correct the highlighted errors.';
      this.loginForm.markAllAsTouched();
      return;
    }

    const employeeDetails = this.loginForm.value;

    this.authService.login(employeeDetails).subscribe({
      next: (res) => {
        this.authService.storeToken(res.token);

        const role = this.authService.getEmployeeRole();
        this.cdr.detectChanges();

        if (role === 'Admin') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'Project Manager') {
          this.router.navigate(['/listprojects']);
        } else {
          this.router.navigate(['/listbuildings']);
        }

        this.loginForm.reset();
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Invalid email or password.';
      },
    });
  }
}
