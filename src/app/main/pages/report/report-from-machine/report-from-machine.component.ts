import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';

import { ReportService } from "app/auth/service";
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-report-from-machine',
  templateUrl: './report-from-machine.component.html',
  styleUrls: ['./report-from-machine.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportFromMachineComponent implements OnInit {
  // Public
  public selectedOption = 50;
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  public selected = [];

  
  // Filter Variable
  public temp = [];
  public previousJobNumberFilter = "";
  public previousBatchFilter = "";
  public previousSerchFilter = "";

  // Data Variable
  public matchineData;
  public exportCSVData;
  public selectBatch: Array<any>;
  
  // ngModel
  public searchJobNumber = '';
  public jobName = "";
  public selectedBatch = [];
  public searchValue = '';

  // Range selection Date Picker
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ReportService} _reportService
   * @param {NgbCalendar} calendar
   * @param {NgbDateParserFormatter} formatter
   */
  constructor(
    private _reportService: ReportService, 
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter 
  ) {
    this._unsubscribeAll = new Subject();
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getToday();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Range selection Date Picker
   *
   * @param date
   */
   onDateSelection(date: NgbDate, datepicker: any) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.serchReportMatchine();
      datepicker.close();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  /**
   * Is Hovered
   *
   * @param date
   */
   isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  /**
   * Is Inside
   *
   * @param date
   */
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   *  Is Range
   *
   * @param date
   */
  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  /**
   *  Format date to yyyy-mm-dd
   *
   * @param date
   */
  dateFormat(date) {
    let day;
    if (date.day < 10){
      day = "0" + date.day;
    }else {
      day = date.day;
    }
    return date.year + "-" + date.month + "-" + day;
  }

  /**
   * Filter Search (Pallet Number)
   *
   * @param event
   */
  filterUpdate(event) {
    const filter = event.target.value;
    this.previousSerchFilter = filter;
    this.temp = this.filterRows(
      this.previousJobNumberFilter,
      this.previousBatchFilter,
      filter
    );
    // Update The Rows
    this.matchineData = this.temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  
  /**
   * Filter By Job Number
   *
   * @param event
   */
   filterByJobNumber(event) {
    const filter = event.target.value;
    this.previousJobNumberFilter = filter;
    this.temp = this.filterRows(
      filter,
      this.previousBatchFilter,
      this.previousSerchFilter
    );
    // Update The Rows
    this.matchineData = this.temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
    
    for (let key in this.matchineData) {
      if(filter.toLowerCase() == this.matchineData[key].job_no.toLowerCase()){
        this.jobName = this.matchineData[key].job_name;
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
   filterByBatch(event) {
    const filter = event ? event.value : '';
    this.previousBatchFilter = filter;
    this.temp = this.filterRows(
      this.previousJobNumberFilter,
      filter,
      this.previousSerchFilter
      );
    // Update The Rows
    this.matchineData = this.temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Filter Rows
   *
   * @param fNumberFilter
   * @param gradeFilter
   * @param checkerFilter
   */
  filterRows(jobNumberFilter, batchFilter, searchFilter): any[] {

    jobNumberFilter = jobNumberFilter.toLowerCase();
    batchFilter = batchFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialJobNumberMatch =
        row.job_no.toLowerCase().indexOf(jobNumberFilter) !== -1 ||
        !jobNumberFilter;
      const isPartialFumberMatch = 
        row.batch_no.toLowerCase().indexOf(batchFilter) !== -1 || 
        !batchFilter;
      const isPartialSerchMatch =
        row.pallet_no.toLowerCase().indexOf(searchFilter) !== -1 ||
        !searchFilter;
      return isPartialJobNumberMatch && isPartialFumberMatch && isPartialSerchMatch;
    });
  }

  /**
   * Set Select Batch
   *
   * @param Response
   */
   setBatch(Response) {
    let array = [];
    let first = { name: "All", value: "" };
    array.push(first);
    for (let key in Response) {
      let p = { name: Response[key].batch_no, value: Response[key].batch_no };
      array.push(p);
    }
    this.selectBatch = array;
  }

  /**
   * Set Select Grade
   */
   serchReportMatchine(){
    this._reportService
      .getMatchineReport(this.dateFormat(this.fromDate), this.dateFormat(this.toDate))
      .pipe()
      .subscribe(
        (Response) => {
          let data = Response.data.data;
          this.matchineData = data;
          this.tempData = this.matchineData;
          this.exportCSVData = this.matchineData;
          // Set Select Batch
          this.setBatch(this.matchineData);
        },
        (error) => console.log(error)
      );
  }
  
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
   ngOnInit(): void {
    // Search Matchine Report from today
    this.serchReportMatchine();
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
