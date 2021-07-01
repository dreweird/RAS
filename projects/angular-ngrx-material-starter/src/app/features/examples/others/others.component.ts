import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/animations/route.animations';
import { PmisService } from '../../../core/services/pmis.service';
import { ActionComponent } from '../action/action.component';
import { MatDialog } from '@angular/material/dialog';
import { EntryDialogComponent } from '../entry-dialog/entry-dialog.component';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Module} from '@ag-grid-community/all-modules'

@Component({
  selector: 'anms-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OthersComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  public modules: Module[] = [ClientSideRowModelModule];

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

  rowSpecialOrder(){
    this.recordService.getAllDocumentType('Others').subscribe(data => {
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
        headerName: 'Others Number',
        field: 'code',
        width: 250,
        filter: 'agTextColumnFilter'
      },
    
      {
        headerName: 'Date Created',
        field: 'date',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: function(params) {
          return  new Date(params.value).toLocaleDateString()
        }
      },
      {
        headerName: 'Date Encoded',
        field: 'date_encoded',
        width: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: function(params) {
          return  new Date(params.value).toLocaleDateString()
        }
      },
      {
        headerName: 'Subject',
        field: 'subject',
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
        width: 400,
        cellRendererFramework: ActionComponent
      }
    ];
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true
    };
 
    this.context = { componentParent: this };
    this.rowSelection = 'single';
    this.frameworkComponents = {
      actionComponent: ActionComponent
    };
  }

  ngOnInit(): void {
    this.rowSpecialOrder();
  }

  getRowNodeId(data) {
    return data.id;
  }

  openDialog() {
    this.dialog.open(EntryDialogComponent, {
      minWidth: '50vh',
      data: { gridApi: this.gridApi, add: true, type:  'Others'}
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
      data: { gridApi: this.gridApi, data: cell, delete: true,  type:  'Others' }
    });
  }

  methodFromParentEdit(cell) {
    this.dialog.open(EntryDialogComponent, {
      minWidth: '50vh',
      data: { gridApi: this.gridApi, data: cell, edit: true, type:  'Others' }
    });
  }
  
}



