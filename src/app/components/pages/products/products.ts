import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuildingService } from '../../../services/building.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit{

  buildings!: any;

  constructor(
    private buildingService: BuildingService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ){}

  ngOnInit(): void {
    this.loadAllBuilding();
  }

  loadAllBuilding(): void{
    this.buildings = this.buildingService.listBuildings();
    this.cdr.markForCheck();

  }

  productDetails(id: number): void{
    this.router.navigate(['productdetails', id])
  }

  

}
