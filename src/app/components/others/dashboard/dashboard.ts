import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { EmployeeService } from '../../../services/employee.service';
import { Project } from '../../../models/project.model';
import { Employee } from '../../../models/employee.model';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { Building } from '../../../models/building.model';
import { BuildingService } from '../../../services/building.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {
  projects: Project[] = [];
  buildings: Building[] = [];
  employees: Employee[] = [];
  customers: Customer[] = [];

  constructor(
    private projectService: ProjectService,
    private buildingService: BuildingService,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAll();
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
  }

}
