import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-addcustomers',
  standalone: false,
  templateUrl: './addcustomers.html',
  styleUrl: './addcustomers.css',
})
export class Addcustomers {
  addCustomerForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  constructor(
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.addCustomerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      photo: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  addCustomer(): void {
    if (this.addCustomerForm.invalid) {
      this.message = 'Please fill out all required fields correctly.';
      this.messageType = 'danger';
      this.markAllFieldsAsTouched();
      return;
    }

    const customer: Customer = { ...this.addCustomerForm.value };

    this.customerService.saveCustomers(customer).subscribe({
      next: () => {
        this.message = 'Customer added successfully.';
        this.messageType = 'success';
        this.addCustomerForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to add customer. Please try again.';
        this.messageType = 'danger';
      },
    });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.addCustomerForm.controls).forEach((field) => {
      const control = this.addCustomerForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  cancel(): void {
    this.router.navigate(['/listcustomers']);
  }
}
