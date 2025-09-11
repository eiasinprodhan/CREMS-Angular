import { ChangeDetectorRef, Component } from '@angular/core';
import { RawMaterials } from '../../../models/rawmaterial.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RawmaterialsService } from '../../../services/rawmaterials.service';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../../../services/stage.service';
import { Stage } from '../../../models/stage.model';
import { RawMaterialsStockOut } from '../../../models/rawmaterialsStockOut.model';

@Component({
  selector: 'app-viewrawmaterials',
  standalone: false,
  templateUrl: './viewrawmaterials.html',
  styleUrl: './viewrawmaterials.css'
})
export class Viewrawmaterials {
  id!: number;
  rawmaterials: RawMaterials[] = [];
  stage: Stage = new Stage();
  selectedRawMaterials?: RawMaterials;
  rawMaterialForm!: FormGroup;
  stockOutlist: RawMaterialsStockOut[] = [];

  message: string = '';
  messageType: string = '';

  stageLoaded = false; // track stage load status

  constructor(
    private rawMaterialsService: RawmaterialsService,
    private stageService: StageService,
    private ar: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id = this.ar.snapshot.params['id'];

    this.rawMaterialForm = this.formBuilder.group({
      rawMaterial: [null, Validators.required],
      name: [''],
      date: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      unit: [''],
    });

    this.listRawMaterials();
    this.getStageById();
    // load stockOut after stage is loaded (to be safe)
  }

  getStageById(): void {
    this.stageService.viewStages(this.id).subscribe({
      next: (data) => {
        this.stage = data;
        this.stageLoaded = true;
        this.listStockOut();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching stage:', err);
        this.message = 'Failed to load stage data.';
        this.messageType = 'danger';
      }
    });
  }

  listRawMaterials(): void {
    this.rawMaterialsService.listRawMaterials().subscribe(data => {
      this.rawmaterials = data;
      this.cdr.markForCheck();
    });
  }

  onItemSelect(event: any): void {
    const selectedId = +event.target.value;
    const selected = this.rawmaterials.find(rm => rm.id === selectedId);
    this.selectedRawMaterials = selected;

    if (selected) {
      this.rawMaterialForm.patchValue({
        name: selected.name,
        unit: selected.unit,
        rawMaterial: selected
      });
    }
  }

  submitStockOut(): void {
    if (!this.stageLoaded) {
      this.message = 'Stage data is still loading. Please wait.';
      this.messageType = 'warning';
      return;
    }

    if (this.rawMaterialForm.invalid) {
      this.rawMaterialForm.markAllAsTouched();
      return;
    }

    const formData = this.rawMaterialForm.getRawValue();
    const selectedRawMaterial: RawMaterials = formData.rawMaterial;

    if (!selectedRawMaterial) {
      this.message = 'Please select a raw material.';
      this.messageType = 'danger';
      return;
    }

    const availableQuantity = selectedRawMaterial.quantity || 0;

    if (formData.quantity > availableQuantity) {
      this.message = 'Stock is not available. Requested quantity exceeds available stock.';
      this.messageType = 'danger';
      return;
    }

    const updatedQuantity = availableQuantity - formData.quantity;

    // Prepare minimal objects with only id to avoid sending full nested objects
    const stockOutData: RawMaterialsStockOut = {
      rawMaterial: { id: selectedRawMaterial.id } as RawMaterials,
      name: selectedRawMaterial.name,
      date: new Date(formData.date),
      quantity: formData.quantity,
      unit: selectedRawMaterial.unit,
      stage: { id: this.stage.id } as Stage
    };

    console.log('Saving StockOut:', stockOutData);

    this.rawMaterialsService.saveStockOut(stockOutData).subscribe({
      next: () => {
        const updatedRawMaterial: RawMaterials = {
          id: selectedRawMaterial.id,
          name: selectedRawMaterial.name,
          quantity: updatedQuantity,
          unit: selectedRawMaterial.unit
        };

        this.rawMaterialsService.updateRawMaterialsQuantity(updatedRawMaterial).subscribe({
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
    this.rawMaterialsService.listStockOut(this.id).subscribe(data => {
      this.stockOutlist = data;
      this.cdr.markForCheck();
    });
  }
}
