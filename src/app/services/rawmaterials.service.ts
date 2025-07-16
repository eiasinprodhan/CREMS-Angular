import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RawMaterials } from '../models/rawmaterial.model';
import { RawMaterialsStockIn } from '../models/rawmaterialsstockin.model';

@Injectable({
  providedIn: 'root'
})
export class RawmaterialsService {
  baseUrlOfRawMaterials: string = "http://localhost:3000/rawmaterials";
  baseUrlOfRawMaterialsStockIn: string = "http://localhost:3000/rawmaterialsstockin";
  baseUrlOfRawMaterialsStockOut: string = "http://localhost:3000/rawmaterialsstockout";

  constructor(
    private http: HttpClient
  ) { }

 listRawMaterials(): Observable<RawMaterials[]> {
  return this.http.get<RawMaterials[]>(this.baseUrlOfRawMaterials);
}


  updateRawMaterialsQuantity(id: string, rawMaterials: RawMaterials): Observable<any>{
    return this.http.put(this.baseUrlOfRawMaterials+"/"+id, rawMaterials);
  }

  saveStockIn(stockIn: RawMaterialsStockIn):Observable<any>{
    return this.http.post(this.baseUrlOfRawMaterialsStockIn, stockIn);
  }

  listStockIn(): Observable<any>{
    return this.http.get(this.baseUrlOfRawMaterialsStockIn);
  }

  saveStockOut(stockOut: RawMaterialsStockIn):Observable<any>{
    return this.http.post(this.baseUrlOfRawMaterialsStockOut, stockOut);
  }

  listStockOut(): Observable<any>{
    return this.http.get(this.baseUrlOfRawMaterialsStockOut);
  }
}
