export class Attendance {
  id?: number;
  employeeId!: number;
  stageId!: number;
  date!: string;
  status!: string;
  salary!: number;

  constructor(
    employeeId?: number,
    stageId?: number,
    date?: string,
    status?: string,
    salary?: number
  ) {
    if (employeeId !== undefined) this.employeeId = employeeId;
    if (stageId !== undefined) this.stageId = stageId;
    if (date !== undefined) this.date = date;
    if (status !== undefined) this.status = status;
    if (salary !== undefined) this.salary = salary;
  }
}
