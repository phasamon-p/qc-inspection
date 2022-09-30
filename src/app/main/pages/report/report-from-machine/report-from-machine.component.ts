import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { ReportFromMachineService } from 'app/main/pages/report/report-from-machine/report-from-machine.service';

@Component({
  selector: 'app-report-from-machine',
  templateUrl: './report-from-machine.component.html',
  styleUrls: ['./report-from-machine.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportFromMachineComponent implements OnInit {
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

  public selectBatch: any = [
    { name: 'All', value: '' },
    { name: 'Run-001', value: 'Run-001' },
    { name: 'Run-002', value: 'Run-002' },
    { name: 'Run-003', value: 'Run-003' },
    { name: 'Run-004', value: 'Run-004' },
    { name: 'Run-005', value: 'Run-005' },
    { name: 'Run-006', value: 'Run-006' },
    { name: 'Run-007', value: 'Run-007' },
    { name: 'Run-008', value: 'Run-008' },
    { name: 'Run-009', value: 'Run-009' },
    { name: 'Run-010', value: 'Run-0010' }
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

  public selectedBatch = [];
  public searchValue = '';
  public searchFromDate = '';
  public searchEndDate = '';
  public searchJobNumber = '';

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {ReportFromMachineService} _reportFromMachineService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _reportFromMachineService: ReportFromMachineService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService
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
    this.selectedBatch = this.selectBatch[0];

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
    this.selectedBatch = this.selectBatch[0];

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
   filterByBatch(event) {
    const filter = event ? event.value : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter, this.previousPlanFilter, this.previousStatusFilter);
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param fNumberFilter
   * @param gradeFilter
   * @param checkerFilter
   */
  filterRows(batchFilter, gradeFilter, checkerFilter): any[] {
    // Reset search on select change
    this.searchValue = '';
    this.searchFromDate = '';
    this.searchEndDate = '';
    this.searchJobNumber = '';

    batchFilter = batchFilter.toLowerCase();
    gradeFilter = gradeFilter.toLowerCase();
    checkerFilter = checkerFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialFumberMatch = row.batch.toLowerCase().indexOf(batchFilter) !== -1 || !batchFilter;
      return isPartialFumberMatch;
    });
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
          this._reportFromMachineService.onReportListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            this.rows = response;
            this.tempData = this.rows;
            this.exportCSVData = this.rows;
          });
        }, 450);
      } else {
        this._reportFromMachineService.onReportListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
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
