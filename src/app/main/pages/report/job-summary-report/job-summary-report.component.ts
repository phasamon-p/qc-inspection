import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { JobNumberService } from "app/auth/service";
import { ReportService } from "app/auth/service";

import { JobSummaryReportService } from 'app/main/pages/report/job-summary-report/job-summary-report.service';

@Component({
  selector: 'app-job-summary-report',
  templateUrl: './job-summary-report.component.html',
  styleUrls: ['./job-summary-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobSummaryReportComponent implements OnInit {
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
  public summaryReport;

  public ReactiveUserDetailsForm: UntypedFormGroup;

  public jobNumber: Array<any>;
  public selectjobNumberLoading = false;
  public jobNumberValue;

  public selectFNumber: any = [
    { name: 'All', value: '' },
    { name: 'F010001', value: 'F010001' },
    { name: 'F010002', value: 'F010002' },
    { name: 'F010003', value: 'F010003' },
    { name: 'F010004', value: 'F010004' },
    { name: 'F010005', value: 'F010005' }
  ];

  public selectGrade: any = [
    { name: 'All', value: '' },
    { name: 'A', value: 'A' },
    { name: 'B', value: 'B' },
    { name: 'C', value: 'C' },
    { name: 'D', value: 'D' },
    { name: 'E', value: 'E' },
    { name: 'F', value: 'F' },
    { name: 'G', value: 'G' }

  ];

  public selectChecker: any = [
    { name: 'All', value: '' },
    { name: 'นายA', value: 'นายA' },
    { name: 'นายB', value: 'นายB' },
    { name: 'นายC', value: 'นายC' }
  ];

  public selectedFnumber = [];
  public selectedGrade = [];
  public selectedChecker = [];
  public searchValue = '';
  public searchFromDate = '';
  public searchEndDate = '';
  public searchJobNumber = '';

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  JobNumberService
  /**
   * Constructor
   *
   * @param {JobNumberService} _jobNumberService
   * @param {ReportService} _reportService
   * @param {CoreConfigService} _coreConfigService
   * @param {JobSummaryReportService} _jobSummaryReportService
   * @param {UntypedFormBuilder} formBuilder
   */
  constructor(
    private _jobNumberService: JobNumberService,
    private _jobSummaryReportService: JobSummaryReportService,
    private __reportService : ReportService,
    private _coreConfigService: CoreConfigService,
    private formBuilder: UntypedFormBuilder,
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
    // Reset ng-select on search
    this.selectedFnumber = this.selectFNumber[0];
    this.selectedGrade = this.selectGrade[0];
    this.selectedChecker = this.selectChecker[0];

    const val = event.target.value.toLowerCase();

    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return (d.jobname.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.batch.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.palletnumber.toLowerCase().indexOf(val) !== -1 || !val);
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
    // Reset ng-select on search
    this.selectedFnumber = this.selectFNumber[0];
    this.selectedGrade = this.selectGrade[0];
    this.selectedChecker = this.selectChecker[0];

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

  /**
   * Filter By F Number
   *
   * @param event
   */
  filterByFnumber(event) {
    const filter = event ? event.value : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter, this.previousPlanFilter, this.previousStatusFilter);
    this.rows = this.temp;
    console.log(event)
  }

  /**
   * Filter By Grade
   *
   * @param event
   */
  filterByGrade(event) {
    const filter = event ? event.value : '';
    this.previousPlanFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, filter, this.previousStatusFilter);
    this.rows = this.temp;
  }

  /**
   * Filter By Checker
   *
   * @param event
   */
  filterByChecker(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, this.previousPlanFilter, filter);
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param fNumberFilter
   * @param gradeFilter
   * @param checkerFilter
   */
  filterRows(fNumberFilter, gradeFilter, checkerFilter): any[] {
    // Reset search on select change
    this.searchValue = '';
    this.searchFromDate = '';
    this.searchEndDate = '';
    this.searchJobNumber = '';

    fNumberFilter = fNumberFilter.toLowerCase();
    gradeFilter = gradeFilter.toLowerCase();
    checkerFilter = checkerFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialFumberMatch = row.fnumber.toLowerCase().indexOf(fNumberFilter) !== -1 || !fNumberFilter;
      const isPartialGradeMatch = row.grade.toLowerCase().indexOf(gradeFilter) !== -1 || !gradeFilter;
      // const isPartialCheckerMatch = row.checker.toLowerCase().indexOf(checkerFilter) !== -1 || !checkerFilter;
      return isPartialFumberMatch && isPartialGradeMatch ;
    });
  }

  getJobNumber(){
    // api Pallet Service
    this.selectjobNumberLoading = true;
    this._jobNumberService.getJobNumber()
      .pipe()
      .subscribe(responce => {
        let array = [];
        for (let key in responce.data) {
          let p = { name: responce.data[key] }
          array.push(p);
        }
        this.jobNumber = array;
      });
    this.selectjobNumberLoading = false;
  }

  public changJobNumber() {
    // api Get Summary Report
    this.__reportService.getSummaryReport(this.jobNumberValue.name)
      .pipe()
      .subscribe(Response => {
        let data = Response.data.data;
        this.summaryReport = data;
        this.tempData = this.summaryReport;
        this.exportCSVData = this.summaryReport;
      });
    
  }
  
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Reactive form initialization
    this.ReactiveUserDetailsForm = this.formBuilder.group(
      {
        jobnumber: [{ name: null }, Validators.required],

      }
    );
    this.ReactiveUserDetailsForm.reset();
    this.getJobNumber();
    // Subscribe config change
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
      if (config.layout.animation === 'zoomIn') {
        setTimeout(() => {
          this._jobSummaryReportService.onReportListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.rows = response;
            this.tempData = this.rows;
            this.exportCSVData = this.rows;
          });
        }, 450);
      } else {
        this._jobSummaryReportService.onReportListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
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
