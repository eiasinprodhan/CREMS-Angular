import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RawmaterialsService } from '../../../services/rawmaterials.service';

@Component({
  selector: 'app-listrawmaterials',
  standalone: false,
  templateUrl: './listrawmaterials.html',
  styleUrl: './listrawmaterials.css'
})
export class Listrawmaterials implements OnInit{
  rawmaterials!: any;

  constructor(
    private rawMaterialsService: RawmaterialsService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.listRawMaterials();
  }

  listRawMaterials(): void{
    this.rawmaterials = this.rawMaterialsService.listRawMaterials();
    this.cdr.markForCheck();
  }

  deleteRawMaterials(id: number): void {
  this.rawMaterialsService.deleteRawMaterials(id).subscribe({
    next: () => {
      this.listRawMaterials();
      this.cdr.markForCheck();
    },
    error: (error) => {
      console.error('Delete failed', error);
    }
  });
}


}
