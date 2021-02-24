import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelOrderComponent } from './travel-order.component';

describe('TravelOrderComponent', () => {
  let component: TravelOrderComponent;
  let fixture: ComponentFixture<TravelOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
