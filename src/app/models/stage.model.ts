import { Employee } from "./employee.model";

export class Stage {
  id!: number;
  name!: string;
  startDate!: Date;
  endDate!: Date;
  employee!:Employee;
}
