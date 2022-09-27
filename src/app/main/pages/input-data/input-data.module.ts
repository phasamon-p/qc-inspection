import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from 'app/auth/helpers';
import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { InputDataComponent } from './input-data/input-data.component';

const routes: Routes = [
  {
    path: 'input-data',
    component: InputDataComponent,
    canActivate: [AuthGuard],
    resolve: {
      // profile: ProfileService
    }
  }
];

@NgModule({
  declarations: [
    InputDataComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    NgbModule,
    ContentHeaderModule,
    CardSnippetModule,
    FormsModule,
    ReactiveFormsModule
  ],
  // providers: [ProfileService]
})
export class InputDataModule { }
