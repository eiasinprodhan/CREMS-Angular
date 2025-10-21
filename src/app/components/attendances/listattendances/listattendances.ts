import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Attendance } from '../../../models/attendance.model';
import { Stage } from '../../../models/stage.model';
import { AttendanceService } from '../../../services/attendance.service';
import { StageService } from '../../../services/stage.service';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../../../models/employee.model';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction.model';
import { isPlatformBrowser } from '@angular/common';
import { StagepaymentService } from '../../../services/stagepayment.service';
import { StagePayment } from '../../../models/stagepayments.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listattendances',
  standalone: false,
  templateUrl: './listattendances.html',
  styleUrl: './listattendances.css'
})
export class Listattendances implements OnInit {
  id!: number;
  attendances: Attendance[] = [];
  employees: Employee[] = [];
  stage: Stage = new Stage();
  today: Date = new Date();
  selectedDate: string = new Date().toISOString().slice(0, 10);
  dateRestriction: boolean = true;
  paidDates: { [date: string]: boolean } = {};
  loading: boolean = false;
  error: string = '';

  // Filtered and Paginated Data
  filteredLabours: number[] = [];
  paginatedLabours: number[] = [];

  // Search and Filter
  searchTerm: string = ''; // Combined search for ID and Employee Name
  sortBySalary: string = ''; // 'asc', 'desc', or ''
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  // Sort options
  sortOptions: any[] = [
    { value: '', label: 'No Sorting' },
    { value: 'asc', label: 'Salary (Low to High)' },
    { value: 'desc', label: 'Salary (High to Low)' }
  ];
  
  // Items per page options
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private stageService: StageService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private transactionService: TransactionService,
    private stagePaymentService: StagepaymentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    console.log('Stage ID:', this.id);
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    console.log('Loading data...');

    forkJoin({
      employees: this.employeeService.listEmployees(),
      stage: this.stageService.viewStages(this.id),
      attendances: this.attendanceService.listAttendances()
    }).subscribe({
      next: (result) => {
        console.log('Data received:', result);
        this.employees = result.employees || [];
        this.stage = result.stage || new Stage();
        this.attendances = result.attendances || [];
        this.loading = false;
        this.onDateChange();
        this.loadPaidDates();
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
        this.error = 'Failed to load data.';
      }
    });
  }

  applyFilters(): void {
    console.log('Applying filters...');
    const labours = this.stage?.labours ?? [];
    console.log('Total labours:', labours.length);
    
    let filtered = [...labours];

    // Filter by ID or Employee Name (combined search)
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(labourId => {
        const matchesId = labourId.toString().includes(searchLower);
        const employeeName = this.getEmployeeName(labourId).toLowerCase();
        const matchesName = employeeName.includes(searchLower);
        return matchesId || matchesName;
      });
      console.log('Filtered by search term:', filtered.length);
    }

    // Sort by Salary
    if (this.sortBySalary) {
      filtered.sort((a, b) => {
        const salaryA = this.getEmployeeSalary(a);
        const salaryB = this.getEmployeeSalary(b);
        
        if (this.sortBySalary === 'asc') {
          return salaryA - salaryB;
        } else if (this.sortBySalary === 'desc') {
          return salaryB - salaryA;
        }
        return 0;
      });
      console.log('Sorted by Salary:', this.sortBySalary);
    }

    this.filteredLabours = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    
    console.log('Filtered labours:', this.filteredLabours.length);
    console.log('Total items:', this.totalItems);
    console.log('Total pages:', this.totalPages);
    
    // Reset to first page when filters change
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLabours = this.filteredLabours.slice(startIndex, endIndex);
    
    console.log('Paginated labours:', this.paginatedLabours.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    console.log('Current page:', this.currentPage);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onItemsPerPageChange(): void {
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.sortBySalary = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  listAttendances(): void {
    this.loading = true;
    this.attendanceService.listAttendances().subscribe({
      next: (data: Attendance[]) => {
        this.attendances = data;
        console.log('Loaded attendances:', this.attendances);
        this.loading = false;
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load attendances.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getEmployeeName(id: number): string {
    const employee = this.employees.find(e => e.id === id);
    return employee ? employee.name : 'Unknown';
  }

  getBaseSalary(id: number): number {
    const employee = this.employees.find(e => e.id === id);
    return employee ? employee.salary : 0;
  }

  getEmployeeSalary(id: number): number {
    const attendance = this.attendances.find(
      a => a.employeeId === id && a.date === this.selectedDate && a.stageId === this.id
    );
    const employee = this.employees.find(e => e.id === id);
    return attendance?.status === 'Present' && employee ? employee.salary : 0;
  }

  getTotalSalary(): number {
    return this.filteredLabours.reduce((total, labourId: number) => {
      return total + this.getEmployeeSalary(labourId);
    }, 0);
  }

  getAttendanceByLabour(id: number): string {
    const attendance = this.attendances.find(a =>
      a.employeeId === id &&
      a.stageId === this.id &&
      a.date === this.selectedDate
    );
    return attendance?.status ?? '';
  }

  getAttendanceIDByLabour(id: number): number {
    const attendance = this.attendances.find(a =>
      a.employeeId === id &&
      a.stageId === this.id &&
      a.date === this.selectedDate
    );
    return attendance ? attendance.id : 0;
  }

  saveAttendance(id: number, status: string, baseSalary: number): void {
    const attendance = new Attendance();
    attendance.employeeId = id;
    attendance.stageId = this.id;
    attendance.date = this.selectedDate;
    attendance.status = status;
    attendance.salary = status === 'Present' ? baseSalary : 0;

    this.attendanceService.addAttendances(attendance).subscribe(() => {
      this.listAttendances();
    });
  }

  editAttendance(attendanceId: number, id: number, status: string, baseSalary: number): void {
    if (!attendanceId) return;
    const attendance = new Attendance();
    attendance.id = attendanceId;
    attendance.employeeId = id;
    attendance.stageId = this.id;
    attendance.date = this.selectedDate;
    attendance.status = status;
    attendance.salary = status === 'Present' ? baseSalary : 0;

    this.attendanceService.editAttendances(attendance).subscribe(() => {
      this.listAttendances();
    });
  }

  isEditable(): boolean {
    const cutoff = new Date();
    cutoff.setHours(24, 0, 0, 0);
    const now = new Date();
    return !this.isPaid() && now <= cutoff;
  }

  onDateChange(): void {
    if (!this.stage.startDate || !this.stage.endDate) {
      this.dateRestriction = false;
      return;
    }

    const selected = new Date(this.selectedDate);
    const start = new Date(this.stage.startDate);
    const end = new Date(this.stage.endDate);
    this.dateRestriction = selected >= start && selected <= end;
    this.applyFilters();
    this.cdr.markForCheck();
  }

  onPay(): void {
    if (confirm('Are you sure you want to mark this day as paid?')) {
      const transaction = new Transaction(
        "Labours daily salary (" + this.selectedDate + ")", 
        this.today, 
        this.getTotalSalary(), 
        false
      );
      
      this.transactionService.saveTransaction(transaction).subscribe({
        next: () => {
          this.savePaidDates();
        },
        error: (err) => {
          console.error('Failed to save transaction:', err);
          alert('Failed to process payment. Please try again.');
        }
      });
    }
  }

  isPaid(): boolean {
    return !!this.paidDates[this.selectedDate];
  }

  savePaidDates(): void {
    let payment = new StagePayment();
    payment.date = this.selectedDate;
    payment.stageId = this.id;
    payment.paid = true;

    this.stagePaymentService.savePayment(payment).subscribe({
      next: () => {
        this.paidDates[this.selectedDate] = true;
        alert('Payment recorded successfully!');
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to save payment status:', err);
        alert('Failed to record payment. Please try again.');
      }
    });
  }

  loadPaidDates(): void {
    console.log('Calling loadPaidDates with stageId:', this.id);
    this.stagePaymentService.getPaymentsByStage(this.id).subscribe({
      next: (payments) => {
        console.log('Loaded payment records:', payments);
        this.paidDates = {};
        payments.forEach(p => {
          this.paidDates[p.date] = p.paid;
        });
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load payment statuses:', err);
      }
    });
  }

  getStatusTotals(): { present: number; absent: number; onLeave: number } {
    const counts = { present: 0, absent: 0, onLeave: 0 };
    this.filteredLabours.forEach(labourId => {
      const status = this.getAttendanceByLabour(labourId);
      if (status === 'Present') counts.present++;
      else if (status === 'Absent') counts.absent++;
      else if (status === 'On Leave') counts.onLeave++;
    });
    return counts;
  }

  getShowingText(): string {
    if (this.totalItems === 0) return 'Showing 0 to 0 of 0 entries';
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Showing ${start} to ${end} of ${this.totalItems} entries`;
  }
}