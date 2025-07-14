import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Attendance } from '../../../models/attendance.model';
import { Stage } from '../../../models/stage.model';
import { AttendanceService } from '../../../services/attendance.service';
import { StageService } from '../../../services/stage.service';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../models/employee.model';
import { error } from 'console';

@Component({
  selector: 'app-listattendances',
  standalone: false,
  templateUrl: './listattendances.html',
  styleUrl: './listattendances.css'
})
export class Listattendances implements OnInit {
  id!: string;
  attendances: any[] = [];
  employees: Employee[] = [];
  stage: Stage = new Stage();
  today: Date = new Date();
  selectedDate: string = new Date().toISOString().slice(0, 10);
  dateRestriction: boolean = true;

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private stageService: StageService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.listEmployees();
    this.viewEmployeeByStage();
    this.listAttendances();
  }

  viewEmployeeByStage(): void {
    this.stageService.viewStages(this.id).subscribe({
      next: (data) => {
        this.stage = data;
        console.log(this.stage);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


  // Get Employee Name by ID
  getEmployeeName(id: string): string {
    const employee = this.employees.find(e => e.id === id);
    return employee ? employee.name : 'Unknown';
  }

  // Get Employee Salary by ID
  getEmployeeSalary(id: string): number {
    const employee = this.employees.find(e => e.id === id);
    return employee ? employee.salary : 0;
  }

  // Load employees
  listEmployees(): void {
    this.employeeService.listEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
      this.cdr.markForCheck();
    });
  }


  // Get Attendance By Labour
  getAttendanceByLabour(id: string): string {
    const date = this.selectedDate;
    const attendance = this.attendances.find(
      a => a.employeeId === id && a.date === date && a.stageId === this.id
    );
    return attendance ? attendance.status : 'Attendance has not been taken.';
  }


  // Get Attendance Id
  getAttendanceIDByLabour(id: string): string {
    const date = this.selectedDate;
    const attendance = this.attendances.find(
      a => a.employeeId === id && a.date === date
    );
    return attendance ? attendance.id : 'Attendance has not been taken.';
  }


  // Load employees
  listAttendances(): void {
    this.attendanceService.listAttendances().subscribe((data: Employee[]) => {
      this.attendances = data;
      this.cdr.markForCheck();
    });
  }

  //Save Attendance
  saveAttendance(id: string, status: string, salary: number): void {
    const date = this.selectedDate;
    const attendance: Attendance = new Attendance(id, this.id, date, status, salary);
    this.attendanceService.addAttendances(attendance).subscribe(data => {
      this.listAttendances();
      this.cdr.markForCheck();
    });
  }


  // Edit Attendance
  editAttendance(attendanceId: string, id: string, status: string, salary: number): void {
    const date = this.selectedDate;
    const attendance: Attendance = new Attendance(id, this.id, date, status, salary);
    this.attendanceService.editAttendances(attendanceId, attendance).subscribe(data => {
      this.listAttendances();
      this.cdr.markForCheck();
    });
  }

  onDateChange(): void {
    const selected = new Date(this.selectedDate);
    const start = new Date(this.stage.startDate);
    const end = new Date(this.stage.endDate);

    if (selected < start || selected > end) {
      this.dateRestriction = false;
    } else {
      this.dateRestriction = true;
      this.cdr.markForCheck();
    }
  }
}
