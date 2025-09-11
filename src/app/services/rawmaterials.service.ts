import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RawMaterials } from '../models/rawmaterial.model';
import { RawMaterialsStockIn } from '../models/rawmaterialsstockin.model';
import { environments } from './environments';
import { RawMaterialsStockOut } from '../models/rawmaterialsStockOut.model';

@Injectable({
  providedIn: 'root'
})
export class RawmaterialsService {
  baseUrlOfRawMaterials: string = environments.apiBaseUrl + "/rawmaterials";
  baseUrlOfRawMaterialsStockIn: string = environments.apiBaseUrl + "/stockindetails";
  baseUrlOfRawMaterialsStockOut: string = environments.apiBaseUrl + "/stockoutdetails";

  constructor(
    private http: HttpClient
  ) { }

  addRawMaterials(rawmaterial: RawMaterials): Observable<any> {
    return this.http.post(this.baseUrlOfRawMaterials + '/', rawmaterial);
  }

  listRawMaterials(): Observable<RawMaterials[]> {
    return this.http.get<RawMaterials[]>(this.baseUrlOfRawMaterials + '/');
  }

  deleteRawMaterials(id: number): Observable<any> {
    return this.http.delete(this.baseUrlOfRawMaterials + '/' + id);
  }


  updateRawMaterialsQuantity(rawMaterials: RawMaterials): Observable<any> {
    return this.http.put(this.baseUrlOfRawMaterials + "/", rawMaterials);
  }

  saveStockIn(stockIn: RawMaterialsStockIn): Observable<any> {
    return this.http.post(this.baseUrlOfRawMaterialsStockIn + '/', stockIn);
  }

  listStockIn(): Observable<any> {
    return this.http.get(this.baseUrlOfRawMaterialsStockIn + '/');
  }

  deleteStockIn(id: number): Observable<any> {
    return this.http.delete(this.baseUrlOfRawMaterialsStockIn + '/' + id);
  }

  saveStockOut(stockOut: RawMaterialsStockOut): Observable<any> {
    return this.http.post(this.baseUrlOfRawMaterialsStockOut + '/', stockOut);
  }

  listStockOut(id: number): Observable<any> {
    return this.http.get(this.baseUrlOfRawMaterialsStockOut + "?stageid=" + id);
  }
}
