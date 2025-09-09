import { Building } from "./building.model";
import { Customer } from "./customer.model";
import { Floor } from "./floor.model";
import { Unit } from "./unit.model";

export class Booking {
    id!: number;
    building!: Building;
    floor!: Floor;
    unit!: Unit;
    customer!: Customer;
    date!: Date;
    isLoan!: boolean;
    downPayment!: number;
    interestRate!: number;
    year!: number;
    amount!: number;
    discount!: number;
    dueAmount!: number;
    emiAmount!: number;
}
