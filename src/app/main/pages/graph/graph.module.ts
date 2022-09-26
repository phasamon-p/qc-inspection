import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'app/auth/helpers';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { JobSummaryGraphComponent } from './job-summary-graph/job-summary-graph.component';

const routes: Routes = [
  {
    path: 'jobsummary-graph',
    component: JobSummaryGraphComponent,
    canActivate: [AuthGuard],
    resolve: {
      // profile: ProfileService
    },
    // data: { animation: 'list' }
  },
];


@NgModule({
  declarations: [
    JobSummaryGraphComponent
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
export class GraphModule { }
