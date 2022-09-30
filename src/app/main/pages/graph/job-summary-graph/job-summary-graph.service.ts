import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobSummaryGraphService {
  private _jsonURL = 'assets/json/report-from-machine.json';
  public rows: any;
  public onReportListChanged: Subject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
   constructor(private _httpClient: HttpClient) {
    // Set the defaults
    // this.onReportListChanged = new BehaviorSubject({});
    this.onReportListChanged = new Subject();
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */

   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this._httpClient.get(this._jsonURL).subscribe(data => {
      this.onReportListChanged.next(data);
     });
  }
}