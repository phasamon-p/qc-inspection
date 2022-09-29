import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyReportService implements Resolve<any>  {
  private _jsonURL = 'assets/json/palet.json';
  public rows: any;
  // public onReportListChanged: BehaviorSubject<any>;
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
    this.getJSON().subscribe(data => {
      this.changeData(data)
      console.log(data);
     });
    // console.log(this.onReportListChanged)
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  public getJSON(): Observable<any> {
    return this._httpClient.get(this._jsonURL);
  }

  public changeData(data) {
    this.onReportListChanged.next(data);
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/users-data').subscribe((response: any) => {
        this.rows = response;
        this.onReportListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }
}
