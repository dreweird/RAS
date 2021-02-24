import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DodComponent } from './dod.component';

describe('DodComponent', () => {
  let component: DodComponent;
  let fixture: ComponentFixture<DodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
