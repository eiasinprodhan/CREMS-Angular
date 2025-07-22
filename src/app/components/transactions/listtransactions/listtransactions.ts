import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-listtransactions',
  standalone: false,
  templateUrl: './listtransactions.html',
  styleUrl: './listtransactions.css'
})
export class Listtransactions {
  transactions!: any;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listTransactions();
  }

  // Get List of Transactions
  listTransactions(): void {
    this.transactions = this.transactionService.listTransaction();
  }

  // View Transaction
  viewTransaction(id: string): void {
    this.router.navigate(['viewtransaction', id]);
  }

  // Edit Transaction
  editTransaction(id: string): void {
    this.router.navigate(['edittransaction', id]);
  }

  // Delete Transaction
  deleteTransaction(id: string): void {
    this.transactionService.deleteTransaction(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cdr.reattach();
        this.listTransactions();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
