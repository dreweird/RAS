
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { selectUserType } from '../../../core/core.module';

@Component({
  selector: 'anms-schedule-action',
  templateUrl: './schedule-action.component.html',
  styleUrls: ['./schedule-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleActionComponent implements ICellRendererAngularComp {

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


  delete() {
    this.params.context.componentParent.methodFromParentDelete(
      this.params.data
    );
  }

  edit() {
    this.params.context.componentParent.methodFromParentEdit(this.params.data);
  }





}
