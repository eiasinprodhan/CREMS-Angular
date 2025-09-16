import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listAllBookings();
  }

  listAllBookings(): void {
    this.bookingService.listBookings().subscribe({
      next: (data) => {
        this.enrichedBookings = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
      }
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
        window.location.reload();
      },
      error: (err) => {
        console.error('Error deleting booking:', err);
      }
    });
  }
}
