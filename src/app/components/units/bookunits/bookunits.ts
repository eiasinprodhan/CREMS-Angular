import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Unit } from '../../../models/unit.model';
import { Floor } from '../../../models/floor.model';
import { Customer } from '../../../models/customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FloorService } from '../../../services/floor.service';
import { CustomerService } from '../../../services/customer.service';
import { UnitService } from '../../../services/unit.service';
import { Building } from '../../../models/building.model';
import { BuildingService } from '../../../services/building.service';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-bookunits',
  standalone: false,
  templateUrl: './bookunits.html',
  styleUrl: './bookunits.css',
})
export class Bookunits implements OnInit {
  id!: number;
  unit: Unit = new Unit();
  floor: Floor = new Floor();
  building: Building = new Building();
  floors: Floor[] = [];
  customers: Customer[] = [];
  selectedCustomer?: Customer;
  today: Date = new Date();

  message: string = '';
  messageType: string = '';

  // Lightbox
  lightboxVisible: boolean = false;
  lightboxIndex: number = 0;

  constructor(
    private ar: ActivatedRoute,
    private unitService: UnitService,
    private floorService: FloorService,
    private buildingService: BuildingService,
    private customerService: CustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // Load customers first
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.listCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.cdr.detectChanges();
        // Now load the unit, so customers are ready
        this.loadUnit();
      },
      error: (err) => {
        console.error('Failed to load customers:', err);
      },
    });
  }

  loadUnit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.unitService.viewUnit(this.id).subscribe({
      next: (data) => {
        this.unit = data;
        this.unit.id = this.id;

        if (this.unit.floorId) this.loadFloor(this.unit.floorId);
        if (this.unit.buildingId) this.loadBuilding(this.unit.buildingId);

        // Set selectedCustomer now that unit and customers are loaded
        this.selectedCustomer = this.customers.find(
          (c) => c.id === this.unit.customerId
        );

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load unit:', err);
      },
    });
  }

  loadFloor(id: number): void {
    this.floorService.viewFloors(id).subscribe({
      next: (data) => {
        this.floor = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load floor:', err);
      },
    });
  }

  loadBuilding(id: number): void {
    this.buildingService.viewBuildings(id).subscribe({
      next: (data) => {
        this.building = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load building:', err);
      },
    });
  }

  updateUnit(): void {
    const transaction: Transaction = new Transaction(
      `Booking: Building - ${this.building.name}, Floor - ${this.floor.name}, Unit - ${this.unit.unitNumber}`,
      new Date(),
      this.unit.price,
      true
    );

    this.transactionService.saveTransaction(transaction).subscribe();

    this.unitService.updateUnitForBook(this.unit).subscribe({
      next: () => {
        // Update selected customer in case customerId changed
        this.selectedCustomer = this.customers.find(
          (c) => c.id === this.unit.customerId
        );
        this.printInvoice();
        this.router.navigate(['/listunits']);
      },
      error: (err) => {
        console.error('Failed to update unit:', err);
        this.message = 'Error updating unit.';
        this.messageType = 'error';
      },
    });
  }

  printInvoice() {
    const element = document.getElementById('invoiceToPrint');
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
        pdf.save(`invoice-${this.unit.unitNumber || 'unit'}.pdf`);

        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
      });
    }, 500);
  }

  // Navigation
  goBack(): void {
    history.back();
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
    if (this.lightboxIndex < this.unit.photoUrls.length - 1) this.lightboxIndex++;
  }
}
