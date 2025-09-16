import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { EmployeeService } from '../../../services/employee.service';
import { TransactionService } from '../../../services/transaction.service';
import { BookingService } from '../../../services/booking.service';
import { Transaction } from '../../../models/transaction.model';
import { BuildingService } from '../../../services/building.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  projects: any[] = [];
  buildings: any[] = [];
  employees: any[] = [];
  customers: any[] = [];
  totalCredit: number = 0;
  totalDebit: number = 0;
  last10Bookings: any[] = [];
  last10Transactions: Transaction[] = [];
  isLoadingBookings: boolean = true;
  isLoadingTransactions: boolean = true;

  constructor(
    private projectService: ProjectService,
    private buildingService: BuildingService,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private transactionService: TransactionService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.loadLast10Bookings();
    this.loadLast10Transactions();
  }

  loadAll(): void {
    this.projectService.listProjects().subscribe(data => {
      this.projects = data;
      this.cdr.markForCheck();
    });
    this.employeeService.listEmployees().subscribe(data => {
      this.employees = data;
      this.cdr.markForCheck();
    });
    this.buildingService.listBuildings().subscribe(data => {
      this.buildings = data;
      this.cdr.markForCheck();
    });
    this.customerService.listCustomers().subscribe(data => {
      this.customers = data;
      this.cdr.markForCheck();
    });

    this.transactionService.listTransaction().subscribe(data => {
      const transactions = data as Transaction[]; // Typecast to Transaction[]
      this.totalCredit = transactions
        .filter((t: Transaction) => t.credit)
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      this.totalDebit = transactions
        .filter((t: Transaction) => !t.credit)
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      this.cdr.markForCheck();
    });
  }

  loadLast10Bookings(): void {
    this.bookingService.listBookings().subscribe({
      next: (data) => {
        const sortedBookings = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.last10Bookings = sortedBookings.slice(0, 10);
        this.isLoadingBookings = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.isLoadingBookings = false;
      }
    });
  }


  loadLast10Transactions(): void {
  this.transactionService.listTransaction().subscribe({
    next: (data: Transaction[]) => { 
      // Parse the date once
      const sortedTransactions = data.sort((a: Transaction, b: Transaction) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Sort descending
      });
      
      // Take the top 10
      this.last10Transactions = sortedTransactions.slice(0, 10);
      this.isLoadingTransactions = false;
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.error('Error fetching transactions:', err);
      this.isLoadingTransactions = false;
    }
  });
}

}
