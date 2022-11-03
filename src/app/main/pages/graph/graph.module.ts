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

import { JobSummaryGraphComponent } from 'app/main/pages/graph/job-summary-graph/job-summary-graph.component';
import { JobSummaryGraphService } from 'app/main/pages/graph/job-summary-graph/job-summary-graph.service';

import { SpreadSheetsModule } from '@grapecity/spread-sheets-angular';

const routes: Routes = [
  {
    path: 'jobsummary-graph',
    component: JobSummaryGraphComponent,
    canActivate: [AuthGuard],
    resolve: {
      uls: JobSummaryGraphService
    },
    data: { animation: 'JobSummaryGraphComponent' }
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
    CsvModule,
    SpreadSheetsModule
  ],
   // providers: [ProfileService]
})
export class GraphModule { }
