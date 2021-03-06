
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/animations/route.animations';
import { PmisService } from '../../../core/services/pmis.service';
import { ActionComponent } from '../action/action.component';
import { MatDialog } from '@angular/material/dialog';
import { EntryDialogComponent } from '../entry-dialog/entry-dialog.component';

import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Module} from '@ag-grid-community/all-modules';

@Component({
  selector: 'anms-moa',
  templateUrl: './moa.component.html',
  styleUrls: ['./moa.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoaComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  public modules: Module[] = [ClientSideRowModelModule, RowGroupingModule];

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
  count;

  rowMemorandum(){
    this.recordService.getAllDocumentType('MOA').subscribe(data => {
      console.log(data);
      this.rowData = data;
      this.count = this.rowData.length;
      this.cd.markForCheck();
    });
  }
  constructor(
    public recordService: PmisService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'id',
        hide: true
      },
      {
        headerName: 'MOA Number',
        field: 'code',
        width: 250,
        filter: 'agTextColumnFilter',
        hide: true
      },
      {
        headerName: 'Year',
        field: 'date',
        width: 150,
        filter: 'agTextColumnFilter',
        rowGroup: true,
        hide: true,
        valueGetter: function(params){
          if(!params.node.group) {
            const d = new Date(params.data.date);
            return d.getUTCFullYear()
          }else{
            return '';
          }
        
        }
   
      },
      {
        headerName: 'Month',
        field: 'date',
        width: 150,
        filter: 'agTextColumnFilter',
        rowGroup: true,
        hide: true,
        valueGetter: function(params){
          if(!params.node.group) {
            const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
            const d = new Date(params.data.date);
            return monthNames[d.getMonth()];
          }else{
            return '';
          }
        
        }
   
      },
      {
        headerName: 'Date Created',
        field: 'date',
        width: 150,
        filter: 'agTextColumnFilter',
        valueGetter: function(params) {
          if(!params.node.group) {
            return  new Date(params.data.date).toLocaleDateString();
          }else{
            return '';
          }
       
        }
      },
      {
        headerName: 'Date Received',
        field: 'date',
        width: 150,
        filter: 'agTextColumnFilter',
        valueGetter: function(params) {
          if(!params.node.group) {
            return  new Date(params.data.date_received).toLocaleDateString();
          }else{
            return '';
          }
       
        }
      },
      {
        headerName: 'Date Encoded',
        field: 'date_encoded',
        width: 150,
        filter: 'agTextColumnFilter',
        valueGetter: function(params) {
          if(!params.node.group) {
            return  new Date(params.data.date_encoded).toLocaleDateString();
          }else{
            return '';
          }
       
        }
      },
      {
        headerName: 'Recipient',
        field: 'recipient',
        width: 300,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Intervention',
        field: 'intervention',
        width: 300,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Classification',
        field: 'classification',
        width: 300,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Actions',
        width: 270,
        cellRendererFramework: ActionComponent
      }
    ];
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true
    };
    this.components = { simpleCellRenderer: getSimpleCellRenderer() };
    this.autoGroupColumnDef = {
      headerName: 'Year - Month / MOA #',
      minWidth: 350,
      pinned: 'left',
      field: 'code',
      cellRendererParams: {
        suppressCount: false,
        innerRenderer: 'simpleCellRenderer'
      }
    }
    this.context = { componentParent: this };
    this.rowSelection = 'single';
    this.frameworkComponents = {
      actionComponent: ActionComponent
    };
   }

  ngOnInit(): void {
    this.rowMemorandum();
  }

  getRowNodeId(data) {
    return data.id;
  }

  openDialog() {
    this.dialog.open(EntryDialogComponent, {
      minWidth: '50vh',
      data: { gridApi: this.gridApi, add: true, type:  'MOA'}
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  methodFromParentUpload(cell) {
    this.dialog.open(EntryDialogComponent, {
      minWidth: '50vh',
      data: { gridApi: this.gridApi, data: cell, upload: true }
    });
  }

  methodFromParentDelete(cell) {
    this.dialog.open(EntryDialogComponent, {
      minWidth: '50vh',
      data: { gridApi: this.gridApi, data: cell, delete: true,  type:  'MOA' }
    });
  }

  methodFromParentEdit(cell) {
    this.dialog.open(EntryDialogComponent, {
      minWidth: '50vh',
      data: { gridApi: this.gridApi, data: cell, edit: true, type:  'MOA' }
    });
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
