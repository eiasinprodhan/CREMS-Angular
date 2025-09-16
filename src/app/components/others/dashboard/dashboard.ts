import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { EmployeeService } from '../../../services/employee.service';
import { Project } from '../../../models/project.model';
import { Employee } from '../../../models/employee.model';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { Building } from '../../../models/building.model';
import { BuildingService } from '../../../services/building.service';
import { TransactionService } from '../../../services/transaction.service';

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
  totalCredit: number = 0;
  totalDebit: number = 0;

  constructor(
    private projectService: ProjectService,
    private buildingService: BuildingService,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private transactionService: TransactionService,
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

    this.transactionService.listTransaction().subscribe(data => {
      const transactions = data;
      this.totalCredit = transactions
        .filter((t: any) => t.credit)
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      this.totalDebit = transactions
        .filter((t: any) => !t.credit)
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      this.cdr.markForCheck();
    });
  }

}
