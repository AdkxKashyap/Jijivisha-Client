import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MythBustersComponent } from './myth-busters.component';

describe('MythBustersComponent', () => {
  let component: MythBustersComponent;
  let fixture: ComponentFixture<MythBustersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MythBustersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MythBustersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
