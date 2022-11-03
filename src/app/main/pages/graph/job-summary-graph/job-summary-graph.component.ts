import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpClient , HttpParams, HttpHeaders} from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { JobSummaryGraphService } from 'app/main/pages/graph/job-summary-graph/job-summary-graph.service';

import { SpreadSheetsModule } from '@grapecity/spread-sheets-angular';
import '@grapecity/spread-sheets-print';
import GC from '@grapecity/spread-sheets';
// import '. ./styles.css';

@Component({
  selector: 'app-job-summary-graph',
  templateUrl: './job-summary-graph.component.html',
  styleUrls: ['./job-summary-graph.component.scss']
})
export class JobSummaryGraphComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';
  public exportCSVData;

  public searchValue = '';
  public searchFromDate = '';
  public searchEndDate = '';
  public searchJobNumber = '';

  spread: GC.Spread.Sheets.Workbook;
    hostStyle = {
        width: 'calc(100% - 280px)',
        height: '100%',
        overflow: 'hidden',
        float: 'left'
    };

    initSpread($event: any) {
      console.log($event);
      this.spread = $event.spread;
      let spread = this.spread;
      let sheet = spread.getActiveSheet();

      console.log(sheet);

      sheet.suspendPaint();
      sheet.options.allowCellOverflow = true;
      sheet.name("Demo");

      sheet.addSpan(1, 1, 1, 3);
      sheet.setValue(1, 1, "Store");
      sheet.addSpan(1, 4, 1, 7);
      sheet.setValue(1, 4, "Goods");
      sheet.addSpan(2, 1, 1, 2);
      sheet.setValue(2, 1, "Area");
      sheet.addSpan(2, 3, 2, 1);
      sheet.setValue(2, 3, "ID");
      sheet.addSpan(2, 4, 1, 2);
      sheet.setValue(2, 4, "Fruits");
      sheet.addSpan(2, 6, 1, 2);
      sheet.setValue(2, 6, "Vegetables");
      sheet.addSpan(2, 8, 1, 2);
      sheet.setValue(2, 8, "Foods");
      sheet.addSpan(2, 10, 2, 1);
      sheet.setValue(2, 10, "Total");

      sheet.setValue(3, 1, "State");
      sheet.setValue(3, 2, "City");
      sheet.setValue(3, 4, "Grape");
      sheet.setValue(3, 5, "Apple");
      sheet.setValue(3, 6, "Potato");
      sheet.setValue(3, 7, "Tomato");
      sheet.setValue(3, 8, "SandWich");
      sheet.setValue(3, 9, "Hamburger");

      sheet.addSpan(4, 1, 7, 1);
      sheet.addSpan(4, 2, 3, 1);
      sheet.addSpan(7, 2, 3, 1);
      sheet.addSpan(10, 2, 1, 2);
      sheet.setValue(10, 2, "Sub Total:");
      sheet.addSpan(11, 1, 7, 1);
      sheet.addSpan(11, 2, 3, 1);
      sheet.addSpan(14, 2, 3, 1);
      sheet.addSpan(17, 2, 1, 2);
      sheet.setValue(17, 2, "Sub Total:");
      sheet.addSpan(18, 1, 1, 3);
      sheet.setValue(18, 1, "Total:");

      sheet.setValue(4, 1, "NC");
      sheet.setValue(4, 2, "Raleigh");
      sheet.setValue(7, 2, "Charlotte");
      sheet.setValue(4, 3, "001");
      sheet.setValue(5, 3, "002");
      sheet.setValue(6, 3, "003");
      sheet.setValue(7, 3, "004");
      sheet.setValue(8, 3, "005");
      sheet.setValue(9, 3, "006");
      sheet.setValue(11, 1, "PA");
      sheet.setValue(11, 2, "Philadelphia");
      sheet.setValue(14, 2, "Pittsburgh");
      sheet.setValue(11, 3, "007");
      sheet.setValue(12, 3, "008");
      sheet.setValue(13, 3, "009");
      sheet.setValue(14, 3, "010");
      sheet.setValue(15, 3, "011");
      sheet.setValue(16, 3, "012");

      sheet.setFormula(10, 4, "=SUM(E5:E10)");
      sheet.setFormula(10, 5, "=SUM(F5:F10)");
      sheet.setFormula(10, 6, "=SUM(G5:G10)");
      sheet.setFormula(10, 7, "=SUM(H5:H10)");
      sheet.setFormula(10, 8, "=SUM(I5:I10)");
      sheet.setFormula(10, 9, "=SUM(J5:J10)");

      sheet.setFormula(17, 4, "=SUM(E12:E17)");
      sheet.setFormula(17, 5, "=SUM(F12:F17)");
      sheet.setFormula(17, 6, "=SUM(G12:G17)");
      sheet.setFormula(17, 7, "=SUM(H12:H17)");
      sheet.setFormula(17, 8, "=SUM(I12:I17)");
      sheet.setFormula(17, 9, "=SUM(J12:J17)");

      for (let i = 0; i < 14; i++) {
          sheet.setFormula(4 + i, 10, "=SUM(E" + (5 + i).toString() + ":J" + (5 + i).toString() + ")");
      }

      sheet.setFormula(18, 4, "=E11+E18");
      sheet.setFormula(18, 5, "=F11+F18");
      sheet.setFormula(18, 6, "=G11+G18");
      sheet.setFormula(18, 7, "=H11+H18");
      sheet.setFormula(18, 8, "=I11+I18");
      sheet.setFormula(18, 9, "=J11+J18");
      sheet.setFormula(18, 10, "=K11+K18");

      sheet.getRange(1, 1, 3, 10).backColor("#D9D9FF");
      sheet.getRange(4, 1, 15, 3).backColor("#D9FFD9");
      sheet.getRange(1, 1, 3, 10).hAlign(GC.Spread.Sheets.HorizontalAlign.center);

      sheet.getRange(1, 1, 18, 10).setBorder(new GC.Spread.Sheets.LineBorder("Black", GC.Spread.Sheets.LineStyle.thin), { all: true });
      sheet.getRange(4, 4, 3, 6).setBorder(new GC.Spread.Sheets.LineBorder("Black", GC.Spread.Sheets.LineStyle.dotted), { inside: true });
      sheet.getRange(7, 4, 3, 6).setBorder(new GC.Spread.Sheets.LineBorder("Black", GC.Spread.Sheets.LineStyle.dotted), { inside: true });
      sheet.getRange(11, 4, 3, 6).setBorder(new GC.Spread.Sheets.LineBorder("Black", GC.Spread.Sheets.LineStyle.dotted), { inside: true });
      sheet.getRange(14, 4, 3, 6).setBorder(new GC.Spread.Sheets.LineBorder("Black", GC.Spread.Sheets.LineStyle.dotted), { inside: true });

      this.fillSampleData(sheet, new GC.Spread.Sheets.Range(4, 4, 6, 6));
      this.fillSampleData(sheet, new GC.Spread.Sheets.Range(11, 4, 6, 6));

      sheet.setColumnWidth(0, 40);
      sheet.setColumnWidth(1, 40);
      sheet.setColumnWidth(3, 40);
      sheet.setColumnWidth(4, 40);
      sheet.setColumnWidth(11, 40);

      this.addFigures(sheet);

      sheet.resumePaint();
  }

  handelPrint() {
    // used to adjust print range, should set with printInfo (refer custom print for detail)
    this.spread.sheets[0].setText(31, 11, " ");
    this.spread.print();
}

fillSampleData(sheet:GC.Spread.Sheets.Worksheet, range: GC.Spread.Sheets.Range) {
   for (let i = 0; i < range.rowCount; i++) {
       for (let j = 0; j < range.colCount; j++) {
           sheet.setValue(range.row + i, range.col + j, Math.ceil(Math.random() * 300));
       }
   }
}

addFigures(sheet:GC.Spread.Sheets.Worksheet) {
  sheet.setFormula(20, 1, "=SUM(K5:K7)");
  sheet.setFormula(20, 2, "=SUM(K8:K10)");
  sheet.setFormula(20, 3, "=SUM(K12:K14)");
  sheet.setFormula(20, 4, "=SUM(K15:K17)");

  sheet.getRange(20, -1, 1, -1).visible(false);
  sheet.addSpan(21, 5, 10, 4);
  sheet.setFormula(21, 5, '=PIESPARKLINE(B21:E21, "#0000FF","#FF0000","#00FF00","#FFFF00")');
  sheet.addSpan(31, 5, 1, 4);
  sheet.getCell(31, 5).text("Figure 1").hAlign(1);
}


  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {JobSummaryGraphService} _jobSummaryServiceService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _jobSummaryServiceService: JobSummaryGraphService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private _http: HttpClient
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return (d.jobname.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.batch.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.date.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * filterUpdate
   *
   * @param event
   */
  filterJobNumber(event) {
    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return (d.jobid.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          this._jobSummaryServiceService.onReportListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.rows = response;
            this.tempData = this.rows;
            this.exportCSVData = this.rows;
          });
        }, 450);
      } else {
        this._jobSummaryServiceService.onReportListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          this.rows = response;
          this.tempData = this.rows;
          this.exportCSVData = this.rows;
        });
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
