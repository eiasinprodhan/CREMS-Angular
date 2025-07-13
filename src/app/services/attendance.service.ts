import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Attendance } from '../models/attendance.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  baseUrl: string = "http://localhost:3000/attendances";

  constructor(
    private http: HttpClient
  ) { }

  addAttendances(attendance: Attendance): Observable<any> {
    return this.http.post(this.baseUrl, attendance);
  }

  listAttendances(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?stage=${id}`);
  }

  viewAttendances(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/' + id);
  }

  editAttendances(id: string, Attendance: Attendance): Observable<any> {
    return this.http.put(this.baseUrl + '/' + id, Attendance);
  }

  deleteAttendances(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  listAttendanceByproject(prodectId: string): Observable<any> {
    return this.http.get(this.baseUrl + "?project=" + prodectId);
  }

}
