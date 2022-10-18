import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
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

  /**
   * Get user by id
   */
  // getById(id: number) {
  //   return this._http.get<User>(`${environment.apiUrl}/api/PL/SearchPalletCode/${id}`);
  // }
}
