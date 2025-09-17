import { Booking } from "./booking.model";

export class LoanPayment {
    id?: number;
    amount!: number;
    date!: Date;
    booking!: Booking;
}