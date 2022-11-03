import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpreadSheetsModule } from '@grapecity/spread-sheets-angular';

import { environment } from 'environments/environment';

type AOA = any[][];

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  /**
  *
  * @param {HttpClient} _http
  * 
  */
  constructor(private _http: HttpClient) { }

  // Public
  filePath: any;
  data: any;


  /**
   * Preview for daily report
   */
  // previewDailyReport() {
    
  //     this._http.get('assets/report-template/daillyTemplate.xlsx', { responseType: 'blob' })
  //     .subscribe((data: any) => {
  //       const reader: FileReader = new FileReader();
    
  //       let dataJson1;
  //       let dataJson2;
    
  //       reader.onload = (e: any) => {
  //         const bstr: string = e.target.result;
  //         const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    
  //         /* grab first sheet */
  //         const wsname1: string = wb.SheetNames[0];
  //         const ws1: XLSX.WorkSheet = wb.Sheets[wsname1];
  
  //         /* save data */
  //         dataJson1 = XLSX.utils.sheet_to_json(ws1);
  //         console.log('dataJson : ' + JSON.stringify(dataJson1));
  //         XLSX.writeFile(wb, 'text.xlsx');
  //       };
  //       reader.readAsBinaryString(data);
  //       console.log('data : ' + JSON.stringify(data));
  //     });

      


  }




  // let queryParams = new HttpParams();
  // queryParams = queryParams.append("JobNO",1);
  // queryParams = queryParams.append("processID",48);
  // return this._http.get<any>(`${environment.serverApiUrl}/api/PL/SearchJobNo`,{params:queryParams});




