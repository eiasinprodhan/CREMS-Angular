export class Attendance {
    id!: number;
    employeeId!: string;
    stageId!: string;
    date!: string;
    status!: string;
    salary!: number;

    constructor(employeeId?: string, stageId?: string, date?: string, status?: string, salary?: number) {
        this.employeeId = employeeId || '';
        this.stageId = stageId || '';
        this.date = date || '';
        this.status = status || '';
        this.salary = salary || 0;
    }
}
