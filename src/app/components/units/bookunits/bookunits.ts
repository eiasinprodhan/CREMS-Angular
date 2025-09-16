import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Unit } from '../../../models/unit.model';
import { Customer } from '../../../models/customer.model';
import { Booking } from '../../../models/booking.model';

import { UnitService } from '../../../services/unit.service';
import { CustomerService } from '../../../services/customer.service';
import { BookingService } from '../../../services/booking.service';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-bookunits',
  standalone: false,
  templateUrl: './bookunits.html',
  styleUrls: ['./bookunits.css'],
})
export class Bookunits implements OnInit {
  id!: number;

  unit: Unit = new Unit();
  customers: Customer[] = [];

  bookingForm!: FormGroup;
  message = '';
  messageType = '';

  lightboxVisible = false;
  lightboxIndex = 0;

  constructor(
    private ar: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private unitService: UnitService,
    private customerService: CustomerService,
    private bookingService: BookingService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.formBuilder.group({
      building: [null],
      floor: [null],
      unit: [null],
      customer: [null, Validators.required],
      date: [this.toDateInputValue(new Date()), Validators.required],
      isLoan: [null, Validators.required],
      amount: [0],
      discount: [0],
      downPayment: [0],
      dueAmount: [0],
      interestRate: [0],
      year: [0],
      emiAmount: [0],
    });

    this.bookingForm.get('isLoan')?.valueChanges.subscribe((raw) => {
      const isLoan = raw === true || raw === 'true';
      this.onPaymentSystemChange(isLoan);
      this.recalcDueAndEmi();
    });

    this.bookingForm.valueChanges.subscribe(() => this.recalcDueAndEmi());
    this.loadCustomers();
    this.loadUnit();
  }

  get isLoanSelected(): boolean {
    const v = this.bookingForm.get('isLoan')?.value;
    return v === true || v === 'true';
  }

  get months(): number | null {
    if (!this.isLoanSelected) return null;
    const y = this.num(this.bookingForm.get('year')?.value);
    return y > 0 ? Math.round(y * 12) : null;
  }

  get principal(): number {
    const amount = Math.max(this.num(this.bookingForm.get('amount')?.value), 0);
    const discountPercent = Math.max(this.num(this.bookingForm.get('discount')?.value), 0);
    const discount = amount * (discountPercent / 100);
    const downPayment = Math.max(this.num(this.bookingForm.get('downPayment')?.value), 0);
    return this.round2(Math.max(amount - discount - downPayment, 0));
  }

  private num(v: any): number {
    const n = typeof v === 'string' ? parseFloat(v) : Number(v);
    return isFinite(n) ? n : 0;
  }

  private round2(n: number): number {
    return Math.round(n * 100) / 100;
  }

  private toDateInputValue(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  private recalcDueAndEmi(): void {
    const principal = this.principal;
    const isLoan = this.isLoanSelected;

    let emiAmount: number | null = null;
    if (isLoan) {
      const rateAnnual = Math.max(this.num(this.bookingForm.get('interestRate')?.value), 0);
      const years = Math.max(this.num(this.bookingForm.get('year')?.value), 0);
      const n = Math.round(years * 12);
      const r = rateAnnual > 0 ? rateAnnual / 100 / 12 : 0;

      if (n > 0) {
        emiAmount = r > 0
          ? principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
          : principal / n;
        emiAmount = this.round2(emiAmount);
      }
    }

    this.bookingForm.patchValue(
      {
        dueAmount: principal,
        emiAmount: emiAmount,
      },
      { emitEvent: false }
    );
  }

  private onPaymentSystemChange(isLoan: boolean): void {
    const interestCtrl = this.bookingForm.get('interestRate');
    const yearCtrl = this.bookingForm.get('year');

    if (isLoan) {
      interestCtrl?.setValidators([Validators.required, Validators.min(0)]);
      yearCtrl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      interestCtrl?.clearValidators();
      yearCtrl?.clearValidators();
      this.bookingForm.patchValue({ emiAmount: null }, { emitEvent: false });
    }

    interestCtrl?.updateValueAndValidity({ emitEvent: false });
    yearCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  loadCustomers(): void {
    this.customerService.listCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load customers:', err),
    });
  }

  loadUnit(): void {
    this.id = +this.ar.snapshot.params['id'];
    this.unitService.viewUnit(this.id).subscribe({
      next: (data) => {
        this.unit = data;
        this.unit.id = this.id;

        this.bookingForm.patchValue(
          {
            building: this.unit.building ?? null,
            floor: this.unit.floor ?? null,
            unit: this.unit ?? null,
            interestRate: this.unit.interestRate ?? null,
            amount: this.unit.price ?? null,
          },
          { emitEvent: false }
        );

        this.recalcDueAndEmi();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load unit:', err),
    });
  }

  bookUnit(): void {
  if (!this.bookingForm.valid) {
    this.message = 'Please fill the required fields.';
    this.messageType = 'error';
    return;
  }

  const v = this.bookingForm.value;
  const isLoan = this.isLoanSelected;

  const booking = new Booking();

  booking.building = v.building?.id ? { id: v.building.id } as any : null;
  booking.floor = v.floor?.id ? { id: v.floor.id } as any : null;
  booking.unit = v.unit?.id ? { id: v.unit.id } as any : null;
  booking.customer = v.customer?.id ? { id: v.customer.id } as any : null;

  booking.date = v.date ? new Date(v.date) : new Date();
  booking.isLoan = isLoan;
  booking.downPayment = Number(v.downPayment);
  booking.interestRate = isLoan ? Number(v.interestRate) || 0 : 0;
  booking.year = isLoan ? Number(v.year) || 0 : 0;
  booking.amount = Number(v.amount) || 0;
  booking.discount = Number(v.discount) || 0;
  booking.dueAmount = Number(v.dueAmount) || 0;
  booking.emiAmount = Number(v.emiAmount) || 0;

  console.log('Sending Booking:', booking);

  this.bookingService.addBooking(booking).subscribe({
    next: () => {
      const description = `Booking: Building - ${this.unit.building?.name}, Floor - ${this.unit.floor?.name}, Unit - ${this.unit?.unitNumber}`;
      const transactionAmount = booking.downPayment;

      const transaction = new Transaction(description, new Date(), transactionAmount, true);
      this.transactionService.saveTransaction(transaction).subscribe({
        error: (err) => console.warn('Transaction save failed:', err),
      });

      this.unit.booked = true;
      this.unitService.updateUnitForBook(this.unit).subscribe({
        next: () => this.router.navigate(['/listunits']),
        error: (err) => {
          console.error('Failed to update unit:', err);
          this.message = 'Booking saved, but failed to update unit status.';
          this.messageType = 'error';
        },
      });
    },
    error: (err) => {
      console.error('Failed to save booking:', err);
      this.message = 'Error saving booking.';
      this.messageType = 'error';
    },
  });
}

  openLightbox(index: number): void {
    this.lightboxIndex = index;
    this.lightboxVisible = true;
  }

  closeLightbox(): void {
    this.lightboxVisible = false;
  }

  prevLightbox(event: Event): void {
    event.stopPropagation();
    if (this.lightboxIndex > 0) this.lightboxIndex--;
  }

  nextLightbox(event: Event): void {
    event.stopPropagation();
    const total = this.unit?.photoUrls?.length ?? 0;
    if (this.lightboxIndex < total - 1) this.lightboxIndex++;
  }
}