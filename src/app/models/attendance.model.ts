import { Employee } from "./employee.model";
import { Stage } from "./stage.model";

export class Attendance {
    id!: number;
    employee!: Employee;
    stage!: Stage;
    date!: string;
    status!: string;
    salary!: number;
}