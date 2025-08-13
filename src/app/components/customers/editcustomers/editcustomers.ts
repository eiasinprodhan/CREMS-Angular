import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-editcustomers',
  standalone: false,
  templateUrl: './editcustomers.html',
  styleUrl: './editcustomers.css'
})
export class Editcustomers {
  id!: string;
  customer: Customer = new Customer();

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadCustomer();
  }

  loadCustomer(): void {
    this.customerService.viewCustomers(this.id).subscribe({
      next: (data) => {
        this.customer = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading customer', err);
      },
    });
  }

  updateCustomer(): void {
    this.customerService.editCustomers(this.id, this.customer).subscribe({
      next: (res) => {
        console.log('Customer updated:', res);
        this.router.navigate(['/listcustomers']);
      },
      error: (err) => {
        console.error('Error updating customer', err);
      },
    });
  }

}
