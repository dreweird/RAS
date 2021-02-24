import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeOfMeetingComponent } from './notice-of-meeting.component';

describe('NoticeOfMeetingComponent', () => {
  let component: NoticeOfMeetingComponent;
  let fixture: ComponentFixture<NoticeOfMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeOfMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeOfMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
