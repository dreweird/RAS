import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoaComponent } from './moa.component';

describe('MoaComponent', () => {
  let component: MoaComponent;
  let fixture: ComponentFixture<MoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
