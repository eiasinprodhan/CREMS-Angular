import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Attendance } from '../../../models/attendance.model';
import { Stage } from '../../../models/stage.model';
import { AttendanceService } from '../../../services/attendance.service';
import { StageService } from '../../../services/stage.service';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../models/employee.model';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-listattendances',
  standalone: false,
  templateUrl: './listattendances.html',
  styleUrl: './listattendances.css'
})
export class Listattendances implements OnInit {
  id!: string;
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
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadPaidDates();
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
        this.onDateChange();
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

  getEmployeeName(id: string): string {
    const employee = this.employees.find(e => e.id === id);
    return employee ? employee.name : 'Unknown';
  }

  getBaseSalary(id: string): number {
    const employee = this.employees.find(e => e.id === id);
    return employee ? employee.salary : 0;
  }

  getEmployeeSalary(id: string): number {
    const attendance = this.attendances.find(
      a => a.employeeId === id && a.date === this.selectedDate && a.stageId === this.id
    );
    const employee = this.employees.find(e => e.id === id);
    return attendance?.status === 'Present' && employee ? employee.salary : 0;
  }

  getTotalSalary(): number {
    return Array.isArray(this.stage.labours)
      ? this.stage.labours.reduce((total, labourId: string) => {
          return total + this.getEmployeeSalary(labourId);
        }, 0)
      : 0;
  }

  getAttendanceByLabour(id: string): string {
    const attendance = this.attendances.find(
      a => a.employeeId === id && a.date === this.selectedDate && a.stageId === this.id
    );

    if (attendance) {
      return attendance.status;
    }

    const salary = this.getEmployeeSalary(id);
    return salary !== 0 ? 'Present' : '';
  }

  getAttendanceIDByLabour(id: string): string {
    const attendance = this.attendances.find(
      a => a.employeeId === id && a.date === this.selectedDate && a.stageId === this.id
    );
    return attendance ? attendance.id : '';
  }

  saveAttendance(id: string, status: string, baseSalary: number): void {
    const salary = status === 'Present' ? baseSalary : 0;
    const attendance = new Attendance(id, this.id, this.selectedDate, status, salary);
    this.attendanceService.addAttendances(attendance).subscribe(() => {
      this.listAttendances();
    });
  }

  editAttendance(attendanceId: string, id: string, status: string, baseSalary: number): void {
    if (!attendanceId) return;
    const salary = status === 'Present' ? baseSalary : 0;
    const attendance = new Attendance(id, this.id, this.selectedDate, status, salary);
    this.attendanceService.editAttendances(attendanceId, attendance).subscribe(() => {
      this.listAttendances();
    });
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
  const transaction = new Transaction("Labours daily salary", this.today, this.getTotalSalary(), false);
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
    localStorage.setItem('paidDates_' + this.id, JSON.stringify(this.paidDates));
    this.cdr.markForCheck();
  }

  loadPaidDates(): void {
    const saved = localStorage.getItem('paidDates_' + this.id);
    if (saved) {
      this.paidDates = JSON.parse(saved);
    }
  }
}
