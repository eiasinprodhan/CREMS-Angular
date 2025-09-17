import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from '../../../models/booking.model';
import { BookingService } from '../../../services/booking.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanpaymentService } from '../../../services/loanpayment.service';
import { LoanPayment } from '../../../models/loanpayments.model';

@Component({
  selector: 'app-viewbooking',
  standalone: false,
  templateUrl: './viewbooking.html',
  styleUrls: ['./viewbooking.css']
})
export class Viewbooking implements OnInit {
  loanPaymentForm!: FormGroup;

  id!: number;
  booking?: Booking;
  isLoading: boolean = true;
  today: Date = new Date();

  alertMessage: string = '';
  alertType: 'success' | 'danger' | '' = '';

  constructor(
    private ar: ActivatedRoute,
    private bookingService: BookingService,
    private loanPaymentService: LoanpaymentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = +this.ar.snapshot.params['id'];

    this.loanPaymentForm = this.formBuilder.group({
      amount: [''],
      date: [''],
      booking: [null]
    });

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


  submitLoanPayment(): void {
    if (!this.booking) return;

    const paymentData = {
      ...this.loanPaymentForm.value,
      booking: { id: this.id }
    };

    this.loanPaymentService.addLoanPayment(paymentData).subscribe({
      next: (response) => {
        this.alertType = 'success';
        this.alertMessage = 'Loan payment saved successfully.';

        // Reset form
        this.loanPaymentForm.reset({
          amount: this.booking?.emiAmount || '',
          date: ''
        });
      },
      error: (err) => {
        console.error('Error creating loan payment:', err);
        this.alertType = 'danger';
        this.alertMessage = 'Failed to save loan payment.';
      }
    });
  }

  printBooking(): void {
    if (!this.booking) return;

    const element = document.getElementById('bookingToPrint');
    if (!element) return;

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

        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
      });
    }, 500);
  }
}
