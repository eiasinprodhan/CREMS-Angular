export class Attendance {
    id!: number;
    employeeId!: number;
    stageId!: number;
    date!: string;
    status!: string;
    salary!: number;

    constructor(employeeId?: number, stageId?: number, date?: string, status?: string, salary?: number) {
        this.employeeId = employeeId || 0;
        this.stageId = stageId || 0;
        this.date = date || '';
        this.status = status || '';
        this.salary = salary || 0;
    }
}
