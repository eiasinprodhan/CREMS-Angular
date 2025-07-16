import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RawmaterialsService } from '../../../services/rawmaterials.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RawMaterials } from '../../../models/rawmaterial.model';

@Component({
  selector: 'app-addrawmaterials',
  standalone: false,
  templateUrl: './addrawmaterials.html',
  styleUrl: './addrawmaterials.css'
})
export class Addrawmaterials implements OnInit {
  rawmaterials: RawMaterials[] = [];
  selectedRawMaterials?: RawMaterials;
  rawMaterialForm!: FormGroup;
  stockinlist!: any;

  message: string = '';
  messageType: string = '';

  constructor(
    private rawMaterialsService: RawmaterialsService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.rawMaterialForm = this.formBuilder.group({
      rawMaterialId: ['', Validators.required],
      name:[''],
      date: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      unitprice: [null, [Validators.required, Validators.min(1)]],
      unit: [''],
      supplier: ['', Validators.required],
      totalprice: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]]
    });

    this.listRawMaterials();
    this.watchPriceChanges();
    this.listStockIn();
  }

  listRawMaterials(): void {
    this.rawMaterialsService.listRawMaterials().subscribe(data => {
      this.rawmaterials = data;
      this.cdr.markForCheck();
    });
  }

  onItemSelect(event: any): void {
    const selectedId = event.target.value;
    this.selectedRawMaterials = this.rawmaterials.find(rm => rm.id === selectedId);
    console.log('Selected:', this.selectedRawMaterials);
    if (this.selectedRawMaterials) {
      this.rawMaterialForm.patchValue({
        name: this.selectedRawMaterials.name,
        unit: this.selectedRawMaterials.unit
      });

      this.updateTotalPrice();
      this.cdr.detectChanges();
    }
    this.updateTotalPrice();
    this.cdr.detectChanges();
  }


  watchPriceChanges(): void {
    this.rawMaterialForm.get('unitprice')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });

    this.rawMaterialForm.get('quantity')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });
  }

  updateTotalPrice(): void {
    const unitprice = this.rawMaterialForm.get('unitprice')?.value || 0;
    const quantity = this.rawMaterialForm.get('quantity')?.value || 0;
    const total = unitprice * quantity;
    this.rawMaterialForm.get('totalprice')?.setValue(total, { emitEvent: false });
  }

  submitStockIn(): void {
    if (this.rawMaterialForm.invalid) {
      this.rawMaterialForm.markAllAsTouched();
      return;
    }

    const stockInData = this.rawMaterialForm.getRawValue();

    this.rawMaterialsService.saveStockIn(stockInData).subscribe({
      next: () => {
        if (!this.selectedRawMaterials) {
          console.error('No raw material selected');
          return;
        }

        const updatedQuantity = Number(stockInData.quantity) + (this.selectedRawMaterials.quantity || 0);


        const updatedRawMaterial: RawMaterials = {
          id: this.selectedRawMaterials.id,
          name: this.selectedRawMaterials.name,
          quantity: updatedQuantity,
          unit: this.selectedRawMaterials.unit
        };

        this.rawMaterialsService.updateRawMaterialsQuantity(updatedRawMaterial.id, updatedRawMaterial).subscribe({
          next: () => {
            this.listRawMaterials();
            this.rawMaterialForm.reset();
            this.selectedRawMaterials = undefined;
            this.message = 'Stock in record added successfully.';
            this.messageType = 'success';
            this.listStockIn();
          },
          error: (updateError) => {
            console.error('Error updating raw materials quantity:', updateError);
            this.message = 'Failed to update raw materials quantity.';
            this.messageType = 'danger';
          }
        });
      },
      error: (err) => {
        console.error('Error adding stock in:', err);
        this.message = 'Failed to add stock in. Please try again.';
        this.messageType = 'danger';
      }
    });
  }

  listStockIn():void{
    this.stockinlist = this.rawMaterialsService.listStockIn();
    this.cdr.markForCheck();
  }

}
