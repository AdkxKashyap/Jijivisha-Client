import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiaDistrictComponent } from './india-district.component';

describe('IndiaDistrictComponent', () => {
  let component: IndiaDistrictComponent;
  let fixture: ComponentFixture<IndiaDistrictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndiaDistrictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndiaDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
