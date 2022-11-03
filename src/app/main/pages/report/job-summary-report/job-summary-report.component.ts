import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
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
  public rows;
  public selectedOption = 50;
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  public selected = [];

  public jobName = "";

  public temp = [];
  public previousJobNumberFilter = "";
  public previousFNumberFilter = "";
  public previousGradeFilter = "";
  public previousSerchFilter = "";

  public exportCSVData;
  public summaryReport;

  public ReactiveUserDetailsForm: UntypedFormGroup;

  
  public selectjobNumberLoading = false;
  

  public jobNumber: Array<any>;
  public selectFNumber: Array<any>;
  public selectGrade: Array<any>;

  public selectedFnumber = [];
  public selectedGrade = [];
  public selectedChecker = [];

  public searchValue = '';
  public jobNumberValue;

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
    const filter = event.target.value;
    this.previousSerchFilter = filter;
    this.temp = this.filterRows(
      this.previousJobNumberFilter,
      this.previousFNumberFilter,
      this.previousGradeFilter,
      filter
    );
    // Update The Rows
    this.summaryReport = this.temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

   /**
   * Filter By Job Number
   *
   * @param event
   */
    filterByJobNumber(event) {
      const filter = event;
      this.previousJobNumberFilter = filter;
      this.temp = this.filterRows(
        filter,
        this.previousFNumberFilter,
        this.previousGradeFilter,
        this.previousSerchFilter
      );
      // Update The Rows
      this.summaryReport = this.temp;
      // Whenever The Filter Changes, Always Go Back To The First Page
      this.table.offset = 0;
      
      for (let key in this.summaryReport) {
        if(filter.toLowerCase() == this.summaryReport[key].job_no.toLowerCase()){
          this.jobName = this.summaryReport[key].job_name;
        }else{
          this.jobName = "";
        }
      }
    }

  /**
   * Filter By F Number
   *
   * @param event
   */
   filterByFnumber(event) {
    const filter = event ? event.value : "";
    this.previousFNumberFilter = filter;
    this.temp = this.filterRows(
      this.previousJobNumberFilter,
      filter,
      this.previousGradeFilter,
      this.previousSerchFilter
    );
    // Update The Rows
    this.summaryReport = this.temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Filter By Grade
   *
   * @param event
   */
  filterByGrade(event) {
    const filter = event ? event.value : "";
    this.previousGradeFilter = filter;
    this.temp = this.filterRows(
      this.previousJobNumberFilter,
      this.previousFNumberFilter,
      filter,
      this.previousSerchFilter
    );
    // Update The Rows
    this.summaryReport = this.temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Filter Rows
   *
   * @param jobNumberFilter
   * @param fNumberFilter
   * @param gradeFilter
   */
  filterRows(jobNumberFilter, fNumberFilter, gradeFilter, searchFilter): any[] {

    jobNumberFilter = jobNumberFilter.toLowerCase();
    fNumberFilter = fNumberFilter.toLowerCase();
    gradeFilter = gradeFilter.toLowerCase();
    searchFilter = searchFilter.toLowerCase();

    return this.tempData.filter((row) => {
      const isPartialJobNumberMatch =
        row.job_no.toLowerCase().indexOf(jobNumberFilter) !== -1 ||
        !jobNumberFilter;
      const isPartialFumberMatch =
        row.f_Number.toLowerCase().indexOf(fNumberFilter) !== -1 ||
        !fNumberFilter;
      const isPartialGradeMatch =
        row.grade.toLowerCase().indexOf(gradeFilter) !== -1 || 
        !gradeFilter;
      const isPartialSerchMatch =
        row.pallet_no.toLowerCase().indexOf(searchFilter) !== -1 ||
        !searchFilter;
      return (
        isPartialJobNumberMatch && isPartialFumberMatch && isPartialGradeMatch && isPartialSerchMatch
      );
    });
  }

  /**
   * Set Select FNumber
   *
   * @param Response
   */
   setFNumber(Response) {
    let array = [];
    let first = { name: "All", value: "" };
    array.push(first);
    for (let key in Response) {
      let p = { name: Response[key].f_Number, value: Response[key].f_Number };
      array.push(p);
    }
    this.selectFNumber = array;
  }

  /**
   * Set Select Grade
   *
   * @param Response
   */
  setGrade(Response) {
    let array = [];
    let first = { name: "All", value: "" };
    array.push(first);
    for (let key in Response) {
      let p = { name: Response[key].grade, value: Response[key].grade };
      array.push(p);
    }
    this.selectGrade = array;
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

  changJobNumber() {
    // api Get Summary Report
    this.__reportService.getSummaryReport(this.jobNumberValue.name)
      .pipe()
      .subscribe(Response => {
        let data = Response.data.data;
        this.summaryReport = data;
        this.tempData = this.summaryReport;
        this.exportCSVData = this.summaryReport;
        // Set Select F Number
        this.setFNumber(this.summaryReport);
        // Set Select Grade
        this.setGrade(this.summaryReport);
        // Set Fitter Attribute
        this.filterByJobNumber(this.jobNumberValue.name);
    
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
