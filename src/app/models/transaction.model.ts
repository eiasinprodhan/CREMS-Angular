export class Transaction {
  id!: string;
  name: string;
  date: Date;
  amount: number;
  credit: boolean;

  constructor(name: string, date: Date, amount: number, credit: boolean) {
    this.name = name;
    this.date = date;
    this.amount = amount;
    this.credit = credit;
  }
}
