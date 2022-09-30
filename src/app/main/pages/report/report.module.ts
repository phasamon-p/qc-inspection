import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthGuard } from 'app/auth/helpers';
import { CsvModule } from '@ctrl/ngx-csv';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';

import { InvoiceListService } from 'app/main/apps/invoice/invoice-list/invoice-list.service';
import { InvoiceModule } from 'app/main/apps/invoice/invoice.module';


import { DailyReportComponent } from 'app/main/pages/report/daily-report/daily-report.component';
import { DailyReportService } from 'app/main/pages/report/daily-report/daily-report.service';

import { JobSummaryReportComponent } from 'app/main/pages/report/job-summary-report/job-summary-report.component';
import { JobSummaryReportService } from 'app/main/pages/report/job-summary-report/job-summary-report.service';

import { ReportFromMachineComponent } from 'app/main/pages/report/report-from-machine/report-from-machine.component';
import { ReportFromMachineService } from 'app/main/pages/report/report-from-machine/report-from-machine.service';

const routes: Routes = [
  {
    path: 'daily-report',
    component: DailyReportComponent,
    canActivate: [AuthGuard],
    resolve: {
      uls: DailyReportService
    },
    data: { animation: 'DailyReportComponent' }
  },
  {
    path: 'jobsummary-report',
    component: JobSummaryReportComponent,
    canActivate: [AuthGuard],
    resolve: {
      uls: JobSummaryReportService
    },
    data: { animation: 'JobSummaryReportComponent' }
  },
  {
    path: 'report-machine',
    component: ReportFromMachineComponent,
    canActivate: [AuthGuard],
    resolve: {
      uls: ReportFromMachineService
    },
    data: { animation: 'ReportFromMachineComponent' }
  },
];

@NgModule({
  declarations: [
    DailyReportComponent,
    JobSummaryReportComponent,
    ReportFromMachineComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    CoreCommonModule, 
    ContentHeaderModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    InvoiceModule,
    CoreSidebarModule,
    CsvModule
  ],
  // providers: [ProfileService]
})
export class ReportModule { }
