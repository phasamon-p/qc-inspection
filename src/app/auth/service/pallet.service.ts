import { Injectable } from '@angular/core';
import { HttpClient , HttpParams, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PalletService {
 /**
   *
   * @param {HttpClient} _http
   * 
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get Search Pallet Code
   */
  getPalletCode(): Observable<any>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("palletCode",1);
    queryParams = queryParams.append("processID",48);
    return this._http.get<any>(`${environment.serverApiUrl}/api/PL/SearchPalletCode`,{params:queryParams});
  }

  getPalletDetail(palletCode : string): Observable<any>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("palletCode",palletCode);
    return this._http.get<any>(`${environment.serverApiUrl}/api/PL/getDetailPallet`,{params:queryParams});
  }

  getBatch(date : string): Observable<any>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("date",date);
    return this._http.get<any>(`${environment.serverApiUrl}/api/PL/getBatch`,{params:queryParams});
  }

  getBatchDetail(date : string, batch : string): Observable<any>{
    let queryParams = JSON.stringify({"date" : date, "batch" : batch});
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this._http.post<any>(`${environment.serverApiUrl}/api/PL/getBatchDetail`,queryParams , httpOptions);
  }

  /**
   * Get Search Pallet Code
   */
   addPL(data : string): Observable<any>{
    let queryParams = JSON.stringify(data);

    // console.log(data);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this._http.post<any>(`${environment.serverApiUrl}/api/PL/add`, queryParams, httpOptions);
  }

  /**
   * Get user by id
   */
  // getById(id: number) {
  //   return this._http.get<User>(`${environment.apiUrl}/api/PL/SearchPalletCode/${id}`);
  // }
}
