import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction.model';


@Component({
  selector: 'app-addtransactions',
  standalone: false,
  templateUrl: './addtransactions.html',
  styleUrl: './addtransactions.css'
})
export class Addtransactions implements OnInit {
  transactionForm!: FormGroup;
  message: string = '';
  messageType: string = 'success';

  constructor(private fb: FormBuilder, private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      amount: [null, [Validators.required, Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
      credit: [null, Validators.required]
    });
  }

  submitTransaction(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const formValue = this.transactionForm.value;
    const transaction = new Transaction(
      formValue.name,
      new Date(formValue.date),
      formValue.amount,
      formValue.credit
    );

    this.transactionService.saveTransaction(transaction).subscribe({
      next: () => {
        this.message = "Transaction saved successfully!";
        this.messageType = "success";
        this.transactionForm.reset();
      },
      error: () => {
        this.message = "Error saving transaction.";
        this.messageType = "danger";
      }
    });
  }

}
