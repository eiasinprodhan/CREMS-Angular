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
  id!: string;
  unit: Unit = new Unit();
  floor: Floor = new Floor();
  building: Building = new Building();
  floors: Floor[] = [];
  customers: Customer[] = [];
  selectedCustomer?: Customer;
  today: Date = new Date();

  message: string = '';
  messageType: string = '';

  constructor(
    private ar: ActivatedRoute,
    private unitService: UnitService,
    private floorService: FloorService,
    private buildingService: BuildingService,
    private customerService: CustomerService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.loadUnit();
    this.loadFloors();
    this.loadCustomers();
  }

  loadUnit(): void {
    this.unitService.viewUnit(this.id).subscribe({
      next: (data) => {
        this.unit = data;

        if (this.unit.floorId) this.loadFloor(this.unit.floorId);
        if (this.unit.buildingId) this.loadBuilding(this.unit.buildingId);

        this.selectedCustomer = this.customers.find(c => c.id === this.unit.customerId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load unit:', err);
      }
    });
  }

  loadFloor(id: string): void {
    this.floorService.viewFloors(id).subscribe({
      next: (data) => {
        this.floor = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load floor:', err);
      }
    });
  }

  loadBuilding(id: string): void {
    this.buildingService.viewBuildings(id).subscribe({
      next: (data) => {
        this.building = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load building:', err);
      }
    });
  }

  loadFloors(): void {
    this.floorService.listFloors().subscribe({
      next: (data) => {
        this.floors = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load floors:', err);
      }
    });
  }

  loadCustomers(): void {
    this.customerService.listCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.selectedCustomer = this.customers.find(c => c.id === this.unit.customerId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load customers:', err);
      }
    });
  }

  updateUnit(): void {
    // Save transaction
    const transaction: Transaction = new Transaction(
      `Booking: Building - ${this.building.name}, Floor - ${this.floor.name}, Unit - ${this.unit.unitNumber}`,
      new Date(),
      this.unit.price,
      true
    );

    this.transactionService.saveTransaction(transaction).subscribe();

    this.unitService.editUnit(this.id, this.unit).subscribe({
      next: () => {
        this.selectedCustomer = this.customers.find(c => c.id === this.unit.customerId);

        this.message = 'Unit updated successfully!';
        this.messageType = 'success';

        setTimeout(() => {
          this.printInvoice();
        }, 300); // delay to ensure `selectedCustomer` is ready
      },
      error: (err) => {
        console.error('Failed to update unit:', err);
        this.message = 'Error updating unit.';
        this.messageType = 'error';
      }
    });
  }


  printInvoice() {
    const element = document.getElementById('invoiceToPrint');
    if (!element) return;

    // Temporarily make visible for rendering
    element.style.visibility = 'visible';
    element.style.position = 'static';
    element.style.left = '0';

    setTimeout(() => {
      html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        scale: 2, // higher quality
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${this.unit.id || 'invoice'}.pdf`);

        // Hide again after PDF generation
        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        element.style.left = '-9999px';

        // 🔁 Route to 'listunits' after saving the PDF
        this.router.navigate(['/listunits']);
      });
    }, 500);
  }


}
