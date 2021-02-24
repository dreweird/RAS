import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectUserType } from '../../../core/core.module';

@Component({
  selector: 'anms-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionComponent implements ICellRendererAngularComp {

  params: any;
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
