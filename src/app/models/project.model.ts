import { Employee } from "./employee.model";

export class Project {
    id!: number;
    name!: string;
    budget!: number;
    startDate!: Date;
    expectedEndDate!: Date;
    projectType!: string;
    projectManager!: Employee;
    description!: string;
}