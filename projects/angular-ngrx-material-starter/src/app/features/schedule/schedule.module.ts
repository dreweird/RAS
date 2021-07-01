import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import { SharedModule } from '../../shared/shared.module';
import { ScheduleRoutingModule } from './schedule.routing.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ScheduleDialogComponent } from './schedule-dialog/schedule-dialog.component';
import { AgGridModule } from 'ag-grid-angular';

import { ScheduleActionComponent } from './schedule-action/schedule-action.component';



@NgModule({
  declarations: [ScheduleComponent, ScheduleDialogComponent, ScheduleActionComponent],
  imports: [CommonModule, SharedModule, ScheduleRoutingModule,  AgGridModule.withComponents([ScheduleActionComponent]),
    CalendarModule.forRoot({
    provide: DateAdapter,
    useFactory: adapterFactory,
  }),]
})
export class ScheduleModule { }
