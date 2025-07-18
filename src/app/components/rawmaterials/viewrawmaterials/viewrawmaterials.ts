import { ChangeDetectorRef, Component } from '@angular/core';
import { RawMaterials } from '../../../models/rawmaterial.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RawmaterialsService } from '../../../services/rawmaterials.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewrawmaterials',
  standalone: false,
  templateUrl: './viewrawmaterials.html',
  styleUrl: './viewrawmaterials.css'
})
export class Viewrawmaterials {
  id!: string;
  rawmaterials: RawMaterials[] = [];
  selectedRawMaterials?: RawMaterials;
  rawMaterialForm!: FormGroup;
  stockOutlist!: any;

  message: string = '';
  messageType: string = '';

  constructor(
    private rawMaterialsService: RawmaterialsService,
    private ar: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];
    this.rawMaterialForm = this.formBuilder.group({
      rawMaterialId: ['', Validators.required],
      stageId: [''],
      name: [''],
      date: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      unit: [''],
    });

    this.listRawMaterials();
    this.watchPriceChanges();
    this.listStockOut();
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
        unit: this.selectedRawMaterials.unit,
        stageId: this.id
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

  submitStockOut(): void {
  if (this.rawMaterialForm.invalid) {
    this.rawMaterialForm.markAllAsTouched();
    return;
  }

  const stockOutData = this.rawMaterialForm.getRawValue();

  if (!this.selectedRawMaterials) {
    this.message = 'Please select a raw material.';
    this.messageType = 'danger';
    return;
  }

  const availableQuantity = this.selectedRawMaterials.quantity || 0;

  // ❌ Prevent saving if requested quantity > available quantity
  if (stockOutData.quantity > availableQuantity) {
    this.message = 'Stock is not available. Requested quantity exceeds available stock.';
    this.messageType = 'danger';
    return; // 💥 Stop execution here
  }

  // ✅ Continue only if quantity is available
  const updatedQuantity = availableQuantity - stockOutData.quantity;

  this.rawMaterialsService.saveStockOut(stockOutData).subscribe({
    next: () => {
      const updatedRawMaterial: RawMaterials = {
        id: this.selectedRawMaterials!.id,
        name: this.selectedRawMaterials!.name,
        quantity: updatedQuantity,
        unit: this.selectedRawMaterials!.unit
      };

      this.rawMaterialsService.updateRawMaterialsQuantity(updatedRawMaterial.id, updatedRawMaterial).subscribe({
        next: () => {
          this.listRawMaterials();
          this.rawMaterialForm.reset();
          this.selectedRawMaterials = undefined;
          this.message = 'Stock out record added successfully.';
          this.messageType = 'success';
          this.listStockOut();
        },
        error: (updateError) => {
          console.error('Error updating raw materials quantity:', updateError);
          this.message = 'Failed to update raw materials quantity.';
          this.messageType = 'danger';
        }
      });
    },
    error: (err) => {
      console.error('Error saving stock out:', err);
      this.message = 'Failed to add stock out. Please try again.';
      this.messageType = 'danger';
    }
  });
}


  listStockOut(): void {
    this.stockOutlist = this.rawMaterialsService.listStockOut(this.id);
    this.cdr.markForCheck();
  }
}
