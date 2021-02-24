import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../../core/core.module';

import { ExamplesComponent } from './examples/examples.component';
// import { AuthenticatedComponent } from './authenticated/authenticated.component';

// import { ParentComponent } from './theming/parent/parent.component';
// import { TodosContainerComponent } from './todos/components/todos-container.component';
// import { StockMarketContainerComponent } from './stock-market/components/stock-market-container.component';
// import { CrudComponent } from './crud/components/crud.component';
import { DocumentComponent } from './document/document.component';
import { TravelOrderComponent } from './travel-order/travel-order.component';
import { MemorandumComponent } from './memorandum/memorandum.component';
import { SpecialOrderComponent } from './special-order/special-order.component';
import { NoticeOfMeetingComponent } from './notice-of-meeting/notice-of-meeting.component';
import { AdvisoryComponent } from './advisory/advisory.component';
import { OthersComponent } from './others/others.component';
import { MoaComponent } from './moa/moa.component';
import { DodComponent } from './dod/dod.component';
// import { FormComponent } from './form/components/form.component';
// import { NotificationsComponent } from './notifications/components/notifications.component';
// import { UserComponent } from './simple-state-management/components/user.component';
// import { ElementsComponent } from './elements/elements.component';

const routes: Routes = [
  {
    path: '',
    component: ExamplesComponent,
    children: [
      {
        path: '',
        redirectTo: 'travel_order',
        pathMatch: 'full'
      },
      {
        path: 'moa',
        component: MoaComponent,
        data: { title: "Travel Order" },
        canActivate: [AuthGuardService]
      },
      {
        path: 'dod',
        component: DodComponent,
        data: { title: "Travel Order" },
        canActivate: [AuthGuardService]
      },
      
      {
        path: 'travel_order',
        component: TravelOrderComponent,
        data: { title: "Travel Order" },
        canActivate: [AuthGuardService]
      },
      {
        path: 'memorandum',
        component: MemorandumComponent,
        data: { title: "Memorandum" },
        canActivate: [AuthGuardService]
      },
      {
        path: 'special_order',
        component: SpecialOrderComponent,
        data: { title: "Special Order" },
        canActivate: [AuthGuardService]
      },
      {
        path: 'meeting',
        component: NoticeOfMeetingComponent,
        data: { title: "Notice of Meeting" },
        canActivate: [AuthGuardService]
      },
      {
        path: 'advisory',
        component: AdvisoryComponent,
        data: { title: "Advisory" },
        canActivate: [AuthGuardService]
      },
      {
        path: 'others',
        component: OthersComponent,
        data: { title: "Advisory" },
        canActivate: [AuthGuardService]
      },
      {
        path: 'document/:id',
        component: DocumentComponent,
        data: { title: "Document" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplesRoutingModule {}
