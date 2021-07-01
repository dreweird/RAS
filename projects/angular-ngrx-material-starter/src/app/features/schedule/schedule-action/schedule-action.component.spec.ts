import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleActionComponent } from './schedule-action.component';

describe('ScheduleActionComponent', () => {
  let component: ScheduleActionComponent;
  let fixture: ComponentFixture<ScheduleActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
