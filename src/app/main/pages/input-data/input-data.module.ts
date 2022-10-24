import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { TimePickerI18nModule } from 'app/main/forms/form-elements/date-time-picker/time-picker-i18n/time-picker-i18n.module';
import { DatePickerI18nModule } from 'app/main/forms/form-elements/date-time-picker/date-picker-i18n/date-picker-i18n.module';

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
    },
    data: { animation: 'select' }
  }
];

@NgModule({
  declarations: [InputDataComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    NgbModule,
    ContentHeaderModule,
    CardSnippetModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    TimePickerI18nModule,
    DatePickerI18nModule
  ],
  // providers: [ProfileService]
})
export class InputDataModule { }
