import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RawmaterialsService } from '../../../services/rawmaterials.service';
import { RawMaterials } from '../../../models/rawmaterial.model';

@Component({
  selector: 'app-editrawmaterials',
  standalone: false,
  templateUrl: './editrawmaterials.html',
  styleUrls: ['./editrawmaterials.css']
})
export class Editrawmaterials {
  addRawMaterialForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  constructor(
    private formBuilder: FormBuilder,
    private rawMaterialsService: RawmaterialsService
  ) {}

  ngOnInit(): void {
    this.addRawMaterialForm = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: [0], // allow 0 as a valid value
      unit: ['', Validators.required]
    });
  }

  addRawMaterial(): void {
    console.log('Form values:', this.addRawMaterialForm.value);

    if (this.addRawMaterialForm.invalid) {
      this.message = 'Please fill out all required fields.';
      this.messageType = 'danger';
      this.markAllFieldsAsTouched();
      return;
    }

    const { name, quantity, unit } = this.addRawMaterialForm.value;

    const rawMaterial = new RawMaterials(name, quantity, unit);

    console.log('Saving raw material:', rawMaterial); // Debug line

    this.rawMaterialsService.addRawMaterials(rawMaterial).subscribe({
      next: () => {
        this.message = 'Raw material added successfully.';
        this.messageType = 'success';
        this.addRawMaterialForm.reset({ quantity: 0 }); // reset to quantity = 0
      },
      error: () => {
        this.message = 'Failed to add raw material. Please try again.';
        this.messageType = 'danger';
      }
    });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.addRawMaterialForm.controls).forEach(field => {
      const control = this.addRawMaterialForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
