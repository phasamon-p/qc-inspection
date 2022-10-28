import { Injectable } from '@angular/core';
import { HttpClient , HttpParams, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobNumberService {
  /**
   *
   * @param {HttpClient} _http
   * 
   */
 constructor(private _http: HttpClient) {}

  /**
   * Get Search Pallet Code
   */
   getJobNumber(): Observable<any>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("JobNO",1);
    queryParams = queryParams.append("processID",48);
    return this._http.get<any>(`${environment.serverApiUrl}/api/PL/SearchJobNo`,{params:queryParams});
  }
}
