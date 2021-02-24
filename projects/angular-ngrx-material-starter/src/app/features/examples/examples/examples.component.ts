import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectIsAuthenticated
} from '../../../core/core.module';

import { State } from '../examples.state';

@Component({
  selector: 'anms-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  user: any;
  examples: { link: string; label: string }[];

  constructor(private store: Store<State>) {
    this.examples = [
      { link: 'travel_order', label: 'Travel Order' },
      { link: 'special_order', label: 'Special Order' },
      { link: 'memorandum', label: 'Memorandum' },
      { link: 'meeting', label: 'Notice of Meeting' },
      { link: 'advisory', label: 'Advisory' },
      { link: 'moa', label: 'MOA' },
      { link: 'dod', label: 'DOD' },
      { link: 'others', label: 'Others' }
   
    ];
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}
