import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent, SelectionType } from "@swimlane/ngx-datatable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { ReportService } from "app/auth/service";
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as snippet from 'app/main/forms/form-elements/date-time-picker/date-time-picker.snippetcode';

@Component({
  selector: "app-daily-report",
  templateUrl: "./daily-report.component.html",
  styleUrls: ["./daily-report.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DailyReportComponent implements OnInit {
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
  public previousCheckerFilter = "";
  public previousSerchFilter = "";

  public exportCSVData;
  public dailyData;

  public selectFNumber: Array<any>;
  public selectGrade: Array<any>;
  public selectChecker: Array<any>;

  public selectedFnumber = [];
  public selectedGrade = [];
  public selectedChecker = [];

  public searchValue = "";
  public jobNumberValue = "";
  
  public searchFromDate = "";
  public searchEndDate = "";
  public searchJobNumber = "";

  public totalCount ="";

   // Range selection Date Picker
   public hoveredDate: NgbDate | null = null;
   public fromDate: NgbDate | null;
   public toDate: NgbDate | null;

   public _snippetCodeRangeSelectionDP = snippet.snippetCodeRangeSelectionDP;

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
  constructor(private _reportService: ReportService, 
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
      this.serchDailyReport();
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
      this.previousFNumberFilter,
      this.previousGradeFilter,
      this.previousCheckerFilter,
      filter
    );
    // Update The Rows
    this.dailyData = this.temp;
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
      this.previousFNumberFilter,
      this.previousGradeFilter,
      this.previousCheckerFilter,
      this.previousSerchFilter
    );
    // Update The Rows
    this.dailyData = this.temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
    
    for (let key in this.dailyData) {
      if(filter.toLowerCase() == this.dailyData[key].job_no.toLowerCase()){
        this.jobName = this.dailyData[key].job_name;
      }else{
        this.jobName = "";
      }
    }
  }

  onActivate(event) {
    if(event.type == 'click') {
        console.log(event);
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
      this.previousCheckerFilter,
      this.previousSerchFilter
    );
    // Update The Rows
    this.dailyData = this.temp;
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
      this.previousCheckerFilter,
      this.previousSerchFilter
    );
    // Update The Rows
    this.dailyData = this.temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Filter By Checker
   *
   * @param event
   */
  filterByChecker(event) {
    const filter = event ? event.value : "";
    this.previousCheckerFilter = filter;
    this.temp = this.filterRows(
      this.previousJobNumberFilter,
      this.previousFNumberFilter,
      this.previousGradeFilter,
      filter,
      this.previousSerchFilter
    );
    // Update The Rows
    this.dailyData = this.temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * Filter Rows
   *
   * @param jobNumberFilter
   * @param fNumberFilter
   * @param gradeFilter
   * @param checkerFilter
   * @param searchFilter
   */
  filterRows(jobNumberFilter, fNumberFilter, gradeFilter, checkerFilter, searchFilter): any[] {

    jobNumberFilter = jobNumberFilter.toLowerCase();
    fNumberFilter = fNumberFilter.toLowerCase();
    gradeFilter = gradeFilter.toLowerCase();
    checkerFilter = checkerFilter.toLowerCase();
    searchFilter = searchFilter.toLowerCase();

    return this.tempData.filter((row) => {
      console.log('row : ' + JSON.stringify(row))
      const isPartialJobNumberMatch =
        row.job_no.toLowerCase().indexOf(jobNumberFilter) !== -1 ||
        !jobNumberFilter;
      const isPartialFumberMatch =
        row.f_Number.toLowerCase().indexOf(fNumberFilter) !== -1 ||
        !fNumberFilter;
      const isPartialGradeMatch =
        row.grade.toLowerCase().indexOf(gradeFilter) !== -1 || 
        !gradeFilter;
      const isPartialCheckerMatch =
        row.checkker_name.toLowerCase().indexOf(checkerFilter) !== -1 ||
        !checkerFilter;
      const isPartialSerchMatch =
        row.pallet_no.toLowerCase().indexOf(searchFilter) !== -1 ||
        !searchFilter;
      
      return (
        isPartialJobNumberMatch && isPartialFumberMatch && isPartialGradeMatch && isPartialCheckerMatch && isPartialSerchMatch
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

  /**
   * Set Select Grade
   *
   * @param Response
   */
  setChecker(Response) {
    let array = [];
    let first = { name: "All", value: "" };
    array.push(first);
    for (let key in Response) {
      let p = {
        name: Response[key].checkker_name,
        value: Response[key].checkker_name,
      };
      // for (let i in array){
      //   if (array[i].name === p.name) {
      //     console.log('index : ' + i + " equal = " +  array[i].name)
      //   }else{
      //     console.log('index : ' + i + " Not equal = " +  array[i].name)
      //   }
      // }
      array.push(p);
    }
    this.selectChecker = array;
  }

  /**
   * Set Select Grade
   */
  serchDailyReport(){
    this._reportService
      .getReportDaily(this.dateFormat(this.fromDate), this.dateFormat(this.toDate))
      .pipe()
      .subscribe(
        (Response) => {
          let data = Response.data.data;
          this.dailyData = data;
          this.tempData = this.dailyData;
          this.exportCSVData = this.dailyData;
          // Set Select F Number
          this.setFNumber(this.dailyData);
          // Set Select Grade
          this.setGrade(this.dailyData);
          // Set Select Checker
          this.setChecker(this.dailyData);
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
    // Search Daily Report from today
    this.serchDailyReport();
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
