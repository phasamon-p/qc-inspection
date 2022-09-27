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

import { JobSummaryReportComponent } from './job-summary-report/job-summary-report.component';
import { ReportFromMachineComponent } from './report-from-machine/report-from-machine.component';

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
      // kbq: BlogListService
    },
    // data: { animation: 'list' }
  },
  {
    path: 'report-machine',
    component: ReportFromMachineComponent,
    canActivate: [AuthGuard],
    resolve: {
      // kbq: BlogListService
    },
    // data: { animation: 'list' }
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
