import { Injectable } from '@angular/core';
import { HttpClient , HttpParams, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  /**
   *
   * @param {HttpClient} _http
   * 
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get Report Daily
   */
   getReportDaily(startDate : string, endDate : string): Observable<any>{
    let queryParams = {"startDate" : startDate, "endDate" : endDate};
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this._http.post<any>(`${environment.serverApiUrl}/api/Report/GetReportDaily`, queryParams, httpOptions);
  }
}
