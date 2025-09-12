import { User } from "./user.model";

export class Employee {
    id!: number;
    name!: string;
    email!: string;
    password!: string;
    phone!: string;
    nid!: number;
    joiningDate!: Date;
    role!: string;
    salaryType!: string;
    salary!: number;
    status!: boolean;
    photo!:string;
    country!:string;
    address!:string;
    totalSalary!:number;
    lastSalary!: Date;
    user!:User
}