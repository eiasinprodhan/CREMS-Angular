import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Unit } from '../../../models/unit.model';
import { Floor } from '../../../models/floor.model';
import { Building } from '../../../models/building.model';
import { Customer } from '../../../models/customer.model';
import { Booking } from '../../../models/booking.model';

import { UnitService } from '../../../services/unit.service';
import { FloorService } from '../../../services/floor.service';
import { BuildingService } from '../../../services/building.service';
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
  floor: Floor = new Floor();
  building: Building = new Building();

  customers: Customer[] = [];

  bookingForm!: FormGroup;

  message = '';
  messageType = '';

  // Lightbox
  lightboxVisible = false;
  lightboxIndex = 0;

  constructor(
    private ar: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private unitService: UnitService,
    private floorService: FloorService,
    private buildingService: BuildingService,
    private customerService: CustomerService,
    private bookingService: BookingService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // Init form with visible details + calculations
    this.bookingForm = this.formBuilder.group({
      // Location/identity (read-only fields in UI)
      buildingId: [null],
      floorId: [null],
      unitId: [null],

      // Booking meta
      customerId: [null, Validators.required],
      date: [this.toDateInputValue(new Date()), Validators.required],
      isLoan: [null, Validators.required],

      // Financials
      amount: [0],
      discount: [0],
      downPayment: [0],
      dueAmount: [0], // calculated

      // Loan-only
      interestRate: [0],
      year: [0],
      emi: [0], // calculated (not sent to backend)
    });

    // Toggle validators when payment system changes
    this.bookingForm.get('isLoan')?.valueChanges.subscribe((raw) => {
      const isLoan = raw === true || raw === 'true';
      this.onPaymentSystemChange(isLoan);
      this.recalcDueAndEmi();
    });

    // Live calculations
    this.bookingForm.valueChanges.subscribe(() => this.recalcDueAndEmi());

    this.loadCustomers();
    this.loadUnit();
  }

  // UI helpers
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

  // Calculate due amount and EMI
  private recalcDueAndEmi(): void {
    const principal = this.principal;
    const isLoan = this.isLoanSelected;

    let emi: number | null = null;
    if (isLoan) {
      const rateAnnual = Math.max(this.num(this.bookingForm.get('interestRate')?.value), 0);
      const years = Math.max(this.num(this.bookingForm.get('year')?.value), 0);
      const n = Math.round(years * 12);
      const r = rateAnnual > 0 ? rateAnnual / 100 / 12 : 0;

      if (n > 0) {
        emi = r > 0
          ? principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
          : principal / n;
        emi = this.round2(emi);
      }
    }

    this.bookingForm.patchValue(
      {
        dueAmount: principal,
        emi: emi,
      },
      { emitEvent: false }
    );
  }

  // Add/remove validators for loan-only fields
  private onPaymentSystemChange(isLoan: boolean): void {
    const interestCtrl = this.bookingForm.get('interestRate');
    const yearCtrl = this.bookingForm.get('year');

    if (isLoan) {
      interestCtrl?.setValidators([Validators.required, Validators.min(0)]);
      yearCtrl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      interestCtrl?.clearValidators();
      yearCtrl?.clearValidators();
      this.bookingForm.patchValue({ emi: null }, { emitEvent: false });
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

        // Patch values that depend on the loaded unit
        this.bookingForm.patchValue(
          {
            buildingId: this.unit.buildingId ?? null,
            floorId: this.unit.floorId ?? null,
            unitId: this.unit.id ?? null,
            interestRate: this.unit.interestRate ?? null,
            amount: this.unit.price ?? null,
          },
          { emitEvent: false }
        );

        this.recalcDueAndEmi();

        if (this.unit.floorId) this.loadFloor(this.unit.floorId);
        if (this.unit.buildingId) this.loadBuilding(this.unit.buildingId);

        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load unit:', err),
    });
  }

  loadFloor(id: number): void {
    this.floorService.viewFloors(id).subscribe({
      next: (data) => {
        this.floor = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load floor:', err),
    });
  }

  loadBuilding(id: number): void {
    this.buildingService.viewBuildings(id).subscribe({
      next: (data) => {
        this.building = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load building:', err),
    });
  }

  // Submit: Save Booking -> Save Transaction (optional) -> Mark Unit booked
  bookUnit(): void {
    if (!this.bookingForm.valid) {
      this.message = 'Please fill the required fields.';
      this.messageType = 'error';
      return;
    }

    const v = this.bookingForm.value;

    const booking = new Booking();
    booking.buildingId = v.buildingId;
    booking.floorId = v.floorId;
    booking.unitId = v.unitId;
    booking.customerId = v.customerId;
    booking.date = v.date ? new Date(v.date) : new Date(); // if your API expects a string, send v.date directly
    booking.isLoan = this.isLoanSelected;
    booking.downPayment = Number(v.downPayment) || 0;
    booking.interestRate = booking.isLoan ? Number(v.interestRate) || 0 : 0;
    booking.year = booking.isLoan ? Number(v.year) || 0 : 0;
    booking.amount = Number(v.amount) || 0;
    booking.discount = Number(v.discount) || 0;
    booking.dueAmount = Number(v.dueAmount) || 0;

    // 1) Save booking
    this.bookingService.addBooking(booking).subscribe({
      next: () => {
        // 2) Optional: Save transaction
        const description = `Booking: Building - ${this.building?.name}, Floor - ${this.floor?.name}, Unit - ${this.unit?.unitNumber}`;
        const transaction = new Transaction(description, new Date(), booking.downPayment, true);
        this.transactionService.saveTransaction(transaction).subscribe({
          error: (err) => console.warn('Transaction save failed:', err),
        });

        // 3) Mark unit as booked
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

  // Lightbox controls
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