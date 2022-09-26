import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'app/auth/helpers';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { JobSummaryReportComponent } from './job-summary-report/job-summary-report.component';
import { ReportFromMachineComponent } from './report-from-machine/report-from-machine.component';

const routes: Routes = [
  {
    path: 'daily-report',
    component: DailyReportComponent,
    canActivate: [AuthGuard],
    resolve: {
      // profile: ProfileService
    },
    // data: { animation: 'list' }
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
    ContentHeaderModule
  ],
  // providers: [ProfileService]
})
export class ReportModule { }
