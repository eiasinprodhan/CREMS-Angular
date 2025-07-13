import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Attendance } from '../../../models/attendance.model';
import { Stage } from '../../../models/stage.model';
import { AttendanceService } from '../../../services/attendance.service';
import { StageService } from '../../../services/stage.service';
import { EmployeeService } from '../../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../models/employee.model';

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

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.listEmployees();
    this.viewAttendances();
  }

  viewAttendances(): void {
    this.attendanceService.listAttendances(this.id).subscribe(data => {
      this.attendances = data;
      this.cdr.markForCheck();
    });
  }

  // Get Employee Name by ID
  getEmployeeName(id: string): string {
    const employee = this.employees.find(e => e.id === id);
    return employee ? employee.name : 'Unknown';
  }

  // Load employees
  listEmployees(): void {
    this.employeeService.listEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
    });
  }

  viewAttendance(id: string): void {
  // Implement viewing logic here
}

editAttendance(id: string): void {
  // Implement editing logic here
}

deleteAttendance(id: string): void {
  // Implement delete confirmation and logic here
}


}
