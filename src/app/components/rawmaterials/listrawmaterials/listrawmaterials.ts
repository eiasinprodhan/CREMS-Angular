import { Component, OnInit } from '@angular/core';
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
    private rawMaterialsService: RawmaterialsService
  ){}

  ngOnInit(): void {
    this.listRawMaterials();
  }

  listRawMaterials(): void{
    this.rawmaterials = this.rawMaterialsService.listRawMaterials();
  }

}
