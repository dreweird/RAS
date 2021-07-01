import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Observable, of, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleDialogComponent } from './schedule-dialog/schedule-dialog.component';


import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Module} from '@ag-grid-community/all-modules';

import { PmisService } from '../../core/services/pmis.service';
import { ScheduleActionComponent } from './schedule-action/schedule-action.component';
import { ROUTE_ANIMATIONS_ELEMENTS, selectUserType } from '../../core/core.module';
import { select, Store } from '@ngrx/store';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};



@Component({
  selector: 'anms-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent  {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  public modules: Module[] = [];

  gridApi;
  gridColumnApi;
  columnDefs;
  defaultColDef;
  rowData;
  frameworkComponents;
  context;
  rowSelection;
  components;
  autoGroupColumnDef;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  // events: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions,
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue,
  //     allDay: true,
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];

  activeDayIsOpen: boolean = true;

  getRow(){
    this.recordService.getAllSchedule().subscribe((data: any) => {
      console.log(data);
        this.rowData = data;
        this.cd.markForCheck();
    });
  }

  getSchedule(){
    this.recordService.getAllSchedule().subscribe((data: any) => {
        for(let i in data) {
          data[i].start = new Date(data[i].start);
          data[i].end = new Date(data[i].end);
          let c = data[i].color;
          data[i].color = colors[c];
          if(data[i].allDay == 1) {data[i].allDay = true } else { data[i].allDay = false }
        }

        this.events = data;
        console.log(this.events )
        this.cd.markForCheck();
    });
  }



  getRowNodeId(data) {
    return data.id;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  isAdmin$: Observable<Boolean>;

  constructor(private modal: NgbModal, public dialog: MatDialog,   public recordService: PmisService,
    private cd: ChangeDetectorRef, private store: Store) {
      this.getRow();
      this.getSchedule();
      this.store.pipe(select(selectUserType)).subscribe((res: any) => {
        if(res == 1) {
          this.isAdmin$ = of(true);
        }else {
          this.isAdmin$ = of(false);
        }
      });
      this.columnDefs = [
        {
          headerName: 'Id',
          field: 'id',
          hide: true
        },
        {
          headerName: 'Title',
          field: 'title',
          width: 250,
          filter: 'agTextColumnFilter',
          hide: true,
        },  
        {
          headerName: 'Year',
          field: 'start',
          width: 150,
          filter: 'agTextColumnFilter',
          rowGroup: true,
          hide: true,
          valueGetter: function(params){
            if(!params.node.group) {
              const d = new Date(params.data.start);
              return d.getUTCFullYear()
            }else{
              return '';
            }
          
          }
     
        },
        {
          headerName: 'Month',
          field: 'start',
          width: 150,
          filter: 'agTextColumnFilter',
          rowGroup: true,
          hide: true,
          valueGetter: function(params){
            if(!params.node.group) {
              const monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];
              const d = new Date(params.data.start);
              return monthNames[d.getMonth()];
            }else{
              return '';
            }
          
          }
        },
    
        {
          headerName: 'Start',
          field: 'start',
          width: 150,
          filter: 'agTextColumnFilter',
          valueGetter: function(params) {
            if(!params.node.group) {
              return  new Date(params.data.start).toLocaleDateString();
            }else{
              return '';
            }
          }
        },
        {
          headerName: 'End',
          field: 'end',
          width: 150,
          filter: 'agTextColumnFilter',
          valueGetter: function(params) {
            if(!params.node.group) {
              return  new Date(params.data.end).toLocaleDateString();
            }else{
              return '';
            }
          }
        },
        {
          headerName: 'Color',
          field: 'color',
          width: 100,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'AllDay',
          field: 'allDay',
          width: 100,
          filter: 'agTextColumnFilter',
        },  
        {
          headerName: 'Actions',
          width: 200,
          cellRendererFramework: ScheduleActionComponent
        }
      ];
      this.defaultColDef = {
        sortable: true,
        resizable: true,
        filter: true
      };
      this.components = { simpleCellRenderer: getSimpleCellRenderer() };
      this.autoGroupColumnDef = {
        headerName: 'Year - Month / Title',
        minWidth: 350,
        pinned: 'left',
        field: 'title',
        cellRendererParams: {
          suppressCount: false,
          innerRenderer: 'simpleCellRenderer'
        }
      }
      this.context = { componentParent: this };
      this.rowSelection = 'single';
      this.frameworkComponents = {
        actionComponent: ScheduleActionComponent
      };
    }

    methodFromParentDelete(cell) {
      this.dialog.open(ScheduleDialogComponent, {
        minWidth: '50vh',
        data: { gridApi: this.gridApi, data: cell, delete: true }
      });
    }
  
    methodFromParentEdit(cell) {
      this.dialog.open(ScheduleDialogComponent, {
        minWidth: '50vh',
        data: { gridApi: this.gridApi, data: cell, edit: true }
      });
    }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.dialog.open(ScheduleDialogComponent, {
      minWidth: '50vh',
      data: { gridApi: this.gridApi, add: true, type:  'Travel Order'}
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}

function getSimpleCellRenderer() {
  function SimpleCellRenderer() {}
  SimpleCellRenderer.prototype.init = function(params) {
    const tempDiv = document.createElement('div');
    if (params.node.group) {
      tempDiv.innerHTML =  '<span style="font-size: 16px;font-weight: bold">' +
     params.value + '</span>';
    } else {
      // console.log(params);
      tempDiv.innerHTML = '<span>' + params.value + '</span>';
    }
    this.eGui = tempDiv;
  };
  SimpleCellRenderer.prototype.getGui = function() {
    return this.eGui;
  };
  return SimpleCellRenderer;
}


