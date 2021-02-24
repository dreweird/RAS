import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LazyElementsModule } from '@angular-extensions/elements';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../../shared/shared.module';
import { environment } from '../../../environments/environment';
import { MomentModule } from 'ngx-moment';
import { AgGridModule } from '@ag-grid-community/angular';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { FEATURE_NAME, reducers } from './examples.state';
import { ExamplesRoutingModule } from './examples-routing.module';
import { ExamplesComponent } from './examples/examples.component';
import { TodosContainerComponent } from './todos/components/todos-container.component';
import { TodosEffects } from './todos/todos.effects';
import { StockMarketContainerComponent } from './stock-market/components/stock-market-container.component';
import { StockMarketEffects } from './stock-market/stock-market.effects';
import { StockMarketService } from './stock-market/stock-market.service';
import { ParentComponent } from './theming/parent/parent.component';
import { ChildComponent } from './theming/child/child.component';
// import { CrudComponent } from './crud/components/crud.component';
import { BooksEffects } from './crud/books.effects';
import { FormComponent } from './form/components/form.component';
import { FormEffects } from './form/form.effects';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { NotificationsComponent } from './notifications/components/notifications.component';
import { ExamplesEffects } from './examples.effects';
import { UserComponent } from './simple-state-management/components/user.component';
import { UserService } from './simple-state-management/user.service';
import { ElementsComponent } from './elements/elements.component';
import { entryDialog } from './crud/components/entryDialog.component';
// import { FileUploadModule } from 'ng2-file-upload';
import {
  DocumentComponent,
  DetachedFileDialog
} from './document/document.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `./assets/i18n/examples/`, '.json');
}
import { MatDialogModule } from '@angular/material/dialog';
import { ProvincePipe, MunicipalPipe } from './crud/components/province.pipe';
import { EntryDialogComponent } from './entry-dialog/entry-dialog.component';
import { ActionComponent } from './action/action.component';
import { TravelOrderComponent } from './travel-order/travel-order.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { SpecialOrderComponent } from './special-order/special-order.component';
import { NoticeOfMeetingComponent } from './notice-of-meeting/notice-of-meeting.component';
import { AdvisoryComponent } from './advisory/advisory.component';
import { OthersComponent } from './others/others.component';
import { SummaryComponent } from './summary/summary.component';
import { MoaComponent } from './moa/moa.component';
import { DodComponent } from './dod/dod.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    LazyElementsModule,
    SharedModule,
    MomentModule,
    ExamplesRoutingModule,
    MatDialogModule,
    PdfViewerModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([
      ExamplesEffects,
      TodosEffects,
      StockMarketEffects,
      BooksEffects,
      FormEffects
    ]),
    AgGridModule.withComponents([ActionComponent]),
    NgxMatSelectSearchModule
  ],
  declarations: [
    ExamplesComponent,
    TodosContainerComponent,
    StockMarketContainerComponent,
    ParentComponent,
    ChildComponent,
    AuthenticatedComponent,
   // CrudComponent,
    FormComponent,
    NotificationsComponent,
    UserComponent,
    ElementsComponent,
    entryDialog,
    ActionComponent,
    DocumentComponent,
    DetachedFileDialog,
    ProvincePipe,
    MunicipalPipe,
    EntryDialogComponent,
    TravelOrderComponent,
    MemorandumComponent,
    SpecialOrderComponent,
    NoticeOfMeetingComponent,
    AdvisoryComponent,
    OthersComponent,
    SummaryComponent,
    MoaComponent,
    DodComponent
  ],
  providers: [StockMarketService, UserService],
  entryComponents: [EntryDialogComponent, DetachedFileDialog]
})
export class ExamplesModule {
  constructor() {}
}
