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
    this.loadData();
  }

  private loadData(): void {
    this.listEmployees();
    this.viewEmployeeByStage();
    this.listAttendances();
  }

  viewEmployeeByStage(): void {
    this.stageService.viewStages(this.id).subscribe({
      next: (data) => {
        this.stage = data;
        console.log('Loaded stage:', this.stage);
        this.onDateChange();

        // ✅ Load payment dates AFTER stage is loaded
        this.loadPaidDates();
      },
      error: (error) => {
        console.error('Error loading stage:', error);
      }
    });
  }

  listEmployees(): void {
    this.employeeService.listEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  listAttendances(): void {
    this.loading = true;
    this.attendanceService.listAttendances().subscribe({
      next: (data: Attendance[]) => {
        this.attendances = data;
        console.log('Loaded attendances:', this.attendances);
        this.loading = false;
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
    return Array.isArray(this.stage.labours)
      ? this.stage.labours.reduce((total, labourId: number) => {
          return total + this.getEmployeeSalary(labourId);
        }, 0)
      : 0;
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
    this.cdr.markForCheck();
  }

  onPay(): void {
    const transaction = new Transaction("Labours daily salary (" + this.selectedDate + ")", this.today, this.getTotalSalary(), false);
    this.transactionService.saveTransaction(transaction).subscribe({
      next: () => {
        this.paidDates[this.selectedDate] = true;
        this.savePaidDates();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to save transaction:', err);
      }
    });
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
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to save payment status:', err);
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
    this.attendances.forEach(a => {
      if (a.date === this.selectedDate && a.stageId === this.id) {
        if (a.status === 'Present') counts.present++;
        else if (a.status === 'Absent') counts.absent++;
        else if (a.status === 'On Leave') counts.onLeave++;
      }
    });
    return counts;
  }
}
