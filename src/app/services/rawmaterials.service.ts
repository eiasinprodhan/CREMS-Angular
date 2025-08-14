import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RawMaterials } from '../models/rawmaterial.model';
import { RawMaterialsStockIn } from '../models/rawmaterialsstockin.model';
import { environments } from './environments';

@Injectable({
  providedIn: 'root'
})
export class RawmaterialsService {
  baseUrlOfRawMaterials: string = environments.apiBaseUrl + "/rawmaterials";
  baseUrlOfRawMaterialsStockIn: string = environments.apiBaseUrl + "/rawmaterialsstockin";
  baseUrlOfRawMaterialsStockOut: string = environments.apiBaseUrl + "/rawmaterialsstockout";

  constructor(
    private http: HttpClient
  ) { }

  listRawMaterials(): Observable<RawMaterials[]> {
    return this.http.get<RawMaterials[]>(this.baseUrlOfRawMaterials + '/');
  }


  updateRawMaterialsQuantity(rawMaterials: RawMaterials): Observable<any> {
    return this.http.put(this.baseUrlOfRawMaterials + "/", rawMaterials);
  }

  saveStockIn(stockIn: RawMaterialsStockIn): Observable<any> {
    return this.http.post(this.baseUrlOfRawMaterialsStockIn, stockIn);
  }

  listStockIn(): Observable<any> {
    return this.http.get(this.baseUrlOfRawMaterialsStockIn);
  }

  saveStockOut(stockOut: RawMaterialsStockIn): Observable<any> {
    return this.http.post(this.baseUrlOfRawMaterialsStockOut, stockOut);
  }

  listStockOut(id: number): Observable<any> {
    return this.http.get(this.baseUrlOfRawMaterialsStockOut + "?stageId=" + id);
  }
}
