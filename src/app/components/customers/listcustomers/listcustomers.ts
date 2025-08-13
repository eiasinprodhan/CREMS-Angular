import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listcustomers',
  standalone: false,
  templateUrl: './listcustomers.html',
  styleUrl: './listcustomers.css'
})
export class Listcustomers {
  customers!: any;

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listCustomers();
  }

  listCustomers(): void {
    this.customers = this.customerService.listCustomers();
  }

  viewCustomer(id: string): void {
    this.router.navigate(['viewcustomers', id]);
  }

  editCustomer(id: string): void {
    this.router.navigate(['editcustomers', id]);
  }

  deleteCustomer(id: string): void {
    this.customerService.deleteCustomers(id).subscribe({
      next: () => {
        console.log('Deleted customer', id);
        this.cdr.reattach();
        this.listCustomers();
      },
      error: err => console.error('Delete error', err)
    });
  }
}
