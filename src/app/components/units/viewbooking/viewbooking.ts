import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from '../../../models/booking.model';
import { Unit } from '../../../models/unit.model';
import { Customer } from '../../../models/customer.model';
import { BookingService } from '../../../services/booking.service';
import { UnitService } from '../../../services/unit.service';
import { CustomerService } from '../../../services/customer.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-viewbooking',
  standalone: false,
  templateUrl: './viewbooking.html',
  styleUrls: ['./viewbooking.css']
})
export class Viewbooking implements OnInit {
  id!: number;
  today: Date = new Date();
  booking?: Booking;
  isLoading: boolean = true;

  constructor(
    private ar: ActivatedRoute,
    private bookingService: BookingService,
    private unitService: UnitService,
    private customerService: CustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = +this.ar.snapshot.params['id'];
    this.loadBooking();
  }

  loadBooking(): void {
    this.bookingService.viewBooking(this.id).subscribe({
      next: (data) => {
        this.booking = data; 
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading booking:', err);
        this.isLoading = false;
      }
    });
  }


  checkReady(): void {
    if (this.booking) {
      this.isLoading = false;
    }
  }

  printBooking(): void {
    if (!this.booking) return;

    const element = document.getElementById('bookingToPrint');
    if (!element) return;

    // Show the element for capturing
    element.style.visibility = 'visible';
    element.style.position = 'static';
    element.style.left = '0';

    setTimeout(() => {
      html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        scale: 2
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`booking-${this.booking?.id}.pdf`);

        // Hide again
        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
      });
    }, 500);
  }
}
