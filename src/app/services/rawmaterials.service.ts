import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { RawMaterials } from '../models/rawmaterial.model';
import { RawMaterialsStockIn } from '../models/rawmaterialsstockin.model';
import { environments } from './environments';
import { RawMaterialsStockOut } from '../models/rawmaterialsStockOut.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RawmaterialsService {
  baseUrlOfRawMaterials: string = environments.apiBaseUrl + "/rawmaterials";
  baseUrlOfRawMaterialsStockIn: string = environments.apiBaseUrl + "/stockindetails";
  baseUrlOfRawMaterialsStockOut: string = environments.apiBaseUrl + "/stockoutdetails";

  constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object
    ) { }

  addRawMaterials(rawmaterial: RawMaterials): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.post(this.baseUrlOfRawMaterials + '/', rawmaterial, { headers });
  }

  listRawMaterials(): Observable<RawMaterials[]> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get<RawMaterials[]>(this.baseUrlOfRawMaterials + '/', { headers });
  }

  deleteRawMaterials(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.delete(this.baseUrlOfRawMaterials + '/' + id, { headers });
  }


  updateRawMaterialsQuantity(rawMaterials: RawMaterials): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.put(this.baseUrlOfRawMaterials + "/", rawMaterials, { headers });
  }

  saveStockIn(stockIn: RawMaterialsStockIn): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.post(this.baseUrlOfRawMaterialsStockIn + '/', stockIn, { headers });
  }

  listStockIn(): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get(this.baseUrlOfRawMaterialsStockIn + '/', { headers });
  }

  deleteStockIn(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.delete(this.baseUrlOfRawMaterialsStockIn + '/' + id, { headers });
  }

  saveStockOut(stockOut: RawMaterialsStockOut): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.post(this.baseUrlOfRawMaterialsStockOut + '/', stockOut, { headers });
  }

  listStockOut(id: number): Observable<any> {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }
    }

    return this.http.get(this.baseUrlOfRawMaterialsStockOut + "?stageid=" + id, { headers });
  }
}
