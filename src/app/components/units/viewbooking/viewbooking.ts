import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from '../../../models/booking.model';
import { BookingService } from '../../../services/booking.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanpaymentService } from '../../../services/loanpayment.service';
import { LoanPayment } from '../../../models/loanpayments.model';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-viewbooking',
  standalone: false,
  templateUrl: './viewbooking.html',
  styleUrls: ['./viewbooking.css'],
})
export class Viewbooking implements OnInit {
  loanPaymentForm!: FormGroup;
  id!: number;
  booking?: Booking;
  loanPayments: LoanPayment[] = [];
  dueEMI!: number;
  isLoading: boolean = true;
  today: Date = new Date();

  alertMessage: string = '';
  alertType: 'success' | 'danger' | '' = '';

  disableSubmit: boolean = false;
  constructor(
    private ar: ActivatedRoute,
    private bookingService: BookingService,
    private loanPaymentService: LoanpaymentService,
    private transactionService: TransactionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = +this.ar.snapshot.params['id'];

    this.loanPaymentForm = this.formBuilder.group({
      amount: [''],
      date: [''],
      booking: [null],
    });

    this.loadBooking();
    this.listLoanPayment();
  }

  loadBooking(): void {
    this.bookingService.viewBooking(this.id).subscribe({
      next: (data) => {
        this.booking = data;
        this.dueEMI = this.booking?.year * 12 - this.loanPayments.length;
        this.loanPaymentForm.patchValue({
          amount: this.booking.emiAmount,
        });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading booking:', err);
        this.isLoading = false;
      },
    });
  }

  listLoanPayment(): void {
    this.loanPaymentService
      .getLoanPaymentsByBookingId(this.id)
      .subscribe((data) => {
        this.loanPayments = data;
        this.checkIfPaymentExistsThisMonth();
        this.cdr.markForCheck();
      });
  }

  deleteLoanPayment(id: number): void {
    this.loanPaymentService.deleteLoanPayment(id).subscribe((data) => {
      this.loadBooking();
      this.listLoanPayment();
      this.cdr.markForCheck();
      console.log(data);
    });
  }

  checkIfPaymentExistsThisMonth(): void {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const paymentThisMonth = this.loanPayments.some((payment) => {
      const paymentDate = new Date(payment.date);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      );
    });

    this.disableSubmit = this.dueEMI <= 0 || paymentThisMonth;
  }

  submitLoanPayment(): void {
    if (!this.booking) return;

    const description = `Booking: Building - ${this.booking.building.name}, Floor - ${this.booking.floor.name}, Unit - ${this.booking.unit.unitNumber}, Customer - ${this.booking.customer.name} EMI Payment`;

    const transaction = new Transaction(
      description,
      this.loanPaymentForm.value.date,
      this.loanPaymentForm.value.amount,
      true
    );

    this.transactionService.saveTransaction(transaction).subscribe({
      next: (data) => {
        const paymentData = {
          ...this.loanPaymentForm.value,
          booking: { id: this.id },
        };

        this.loanPaymentService.addLoanPayment(paymentData).subscribe({
          next: (response) => {
            this.alertType = 'success';
            this.alertMessage = 'Loan payment saved successfully.';
            this.listLoanPayment();
            this.checkIfPaymentExistsThisMonth();
            this.loanPaymentForm.reset({
              amount: this.booking?.emiAmount || '',
              date: '',
            });
            this.loadBooking();
            this.listLoanPayment();
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error creating loan payment:', err);
            this.alertType = 'danger';
            this.alertMessage = 'Failed to save loan payment.';
          },
        });
      },
      error: (err) => {
        console.error('Error saving transaction:', err);
        this.alertType = 'danger';
        this.alertMessage = 'Failed to save transaction.';
      },
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
        scale: 2,
      }).then((canvas) => {
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
