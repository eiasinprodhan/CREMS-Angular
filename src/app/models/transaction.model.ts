export class Transaction {
  id!: string;
  name: string;
  date: Date;
  amount: number;

  constructor(name: string, date: Date, amount: number) {
    this.name = name;
    this.date = date;
    this.amount = amount;
  }
}
