import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from '../../../models/booking.model';
import { BookingService } from '../../../services/booking.service';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listbooking',
  standalone: false,
  templateUrl: './listbooking.html',
  styleUrls: ['./listbooking.css'],
})
export class Listbooking implements OnInit {
  enrichedBookings: any[] = [];

  constructor(
    private bookingService: BookingService,
    private customerService: CustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.bookingService.listBookings(),
      this.customerService.listCustomers(),
    ]).subscribe(([bookings, customers]) => {
      const customerMap = new Map<number, string>(
        customers.map((c: Customer): [number, string] => [c.id, c.name])
      );

      this.enrichedBookings = bookings.map((booking) => ({
        ...booking,
        customerName: customerMap.get(booking.customerId) || 'Unknown',
      }));
    });
  }

  viewBooking(id: number): void {
    this.router.navigate(['/viewbooking', id]);
  }

  editBooking(id: number): void {
    this.router.navigate(['/editbooking', id]);
  }

  deleteBooking(id: number): void {
    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting booking:', err);
      }
    });
  }
}
