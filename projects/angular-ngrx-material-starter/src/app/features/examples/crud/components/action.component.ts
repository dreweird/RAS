import { Component, Inject } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Store, select } from '@ngrx/store';
import { selectUserType } from '../../../../core/auth/auth.selectors';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-action-component',
  template: `
    <div *ngIf="!params.node.group">
      <button *ngIf="(isAdmin$ | async)"
        type="button"
        mat-button
        (click)="upload()"
        matTooltip="Upload File"
      >
        <fa-icon icon="upload"></fa-icon>
      </button>
      <button type="button" mat-button matTooltip="View">
        <a [routerLink]="['/doc/document', code]" routerLinkActive="active"
          ><fa-icon icon="eye"></fa-icon
        ></a>
      </button>
      <button *ngIf="(isAdmin$ | async)"
        type="button"
        mat-button
        color="accent"
        (click)="edit()"
        matTooltip="Edit"
      >
        <fa-icon icon="edit"></fa-icon>
      </button>
      <button *ngIf="(isAdmin$ | async)"
        type="button"
        mat-button
        color="warn"
        (click)="delete()"
        matTooltip="Delete"
      >
        <fa-icon icon="trash"></fa-icon>
      </button>
    </div>
  `
})
export class ActionComponent implements ICellRendererAngularComp {
  params: any;
  code;
  isAdmin$: Observable<Boolean>;

  constructor(private store: Store) {
  this.store.pipe(select(selectUserType)).subscribe((res: any) => {
    if(res == 1) {
      this.isAdmin$ = of(true);
    }else {
      this.isAdmin$ = of(false);
    }
  });
  }

  agInit(params: any): void {
    this.params = params;
    this.code = this.params.data.code;
  }

  refresh(): boolean {
    return false;
  }

  upload() {
    this.params.context.componentParent.methodFromParentUpload(
      this.params.data
    );
  }

  delete() {
    this.params.context.componentParent.methodFromParentDelete(
      this.params.data
    );
  }

  edit() {
    this.params.context.componentParent.methodFromParentEdit(this.params.data);
  }
}
