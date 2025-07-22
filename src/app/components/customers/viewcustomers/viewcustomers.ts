import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viewcustomers',
  standalone: false,
  templateUrl: './viewcustomers.html',
  styleUrl: './viewcustomers.css'
})
export class Viewcustomers implements OnInit{
  customer: Customer = new Customer();
  id!: string;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
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
      },
      error: (error) => {
        console.error('Error loading customer:', error);
      }
    });
  }
}
