import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-listtransactions',
  standalone: false,
  templateUrl: './listtransactions.html',
  styleUrls: ['./listtransactions.css']
})
export class Listtransactions {
  allTransactions: any[] = [];
  transactions: any[] = [];
  selectedDate: string = '';
  totalCredit: number = 0;
  totalDebit: number = 0;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setTodayAsDefaultDate();
    this.listTransactions();
  }

  setTodayAsDefaultDate(): void {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  listTransactions(): void {
    this.transactionService.listTransaction().subscribe({
      next: (data) => {
        this.allTransactions = data;
        this.filterByDate();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
      }
    });
  }

  filterByDate(): void {
    if (this.selectedDate) {
      this.transactions = this.allTransactions.filter((txn: any) =>
        txn.date.startsWith(this.selectedDate)
      );
    } else {
      this.transactions = this.allTransactions;
    }

    // ✅ Calculate totals
    this.totalCredit = this.transactions
      .filter(txn => txn.credit)
      .reduce((sum, txn) => sum + txn.amount, 0);

    this.totalDebit = this.transactions
      .filter(txn => !txn.credit)
      .reduce((sum, txn) => sum + txn.amount, 0);

    this.cdr.markForCheck();
  }

  deleteTransaction(id: number): void {
    this.transactionService.deleteTransaction(id).subscribe({
      next: () => {
        this.listTransactions();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  viewTransaction(id: number): void {
    this.router.navigate(['viewtransaction', id]);
  }

  editTransaction(id: number): void {
    this.router.navigate(['edittransaction', id]);
  }

  printTransactionsPdf(): void {
    const element = document.getElementById('pdf-section');
    if (!element) return;

    const prevStyles = {
      visibility: element.style.visibility,
      position: element.style.position,
      left: element.style.left,
    };

    // Show hidden element for capture
    element.style.visibility = 'visible';
    element.style.position = 'static';
    element.style.left = '0';

    setTimeout(() => {
      html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 2
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`transactions-${this.selectedDate}.pdf`);
      }).catch(err => {
        console.error('PDF error:', err);
      }).finally(() => {
        // Restore original styles
        element.style.visibility = prevStyles.visibility;
        element.style.position = prevStyles.position;
        element.style.left = prevStyles.left;
      });
    }, 500);
  }
}
