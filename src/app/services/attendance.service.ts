import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Attendance } from '../models/attendance.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl: string = "http://localhost:3000/attendances"; // Base URL of the API (adjust for production)

  constructor(private http: HttpClient) {}

  // Add a new attendance record
  addAttendances(attendance: Attendance): Observable<any> {
    return this.http.post(this.baseUrl, attendance);
  }

  // List all attendance records
  listAttendances(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // View a specific attendance record by ID
  viewAttendances(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // View attendance records by stage ID
  viewAttendancesByStage(stageId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?stageId=${stageId}`);
  }

  // Edit an existing attendance record by ID
  editAttendances(id: string, attendance: Attendance): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, attendance);
  }

  // Delete an attendance record by ID
  deleteAttendances(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}?stageId=${id}`);
  }

  // List attendance records by project ID
  listAttendanceByProject(projectId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?project=${projectId}`);
  }

}
