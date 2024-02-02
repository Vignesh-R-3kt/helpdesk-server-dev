import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeviceComponent } from './view-device.component';

describe('ViewDeviceComponent', () => {
  let component: ViewDeviceComponent;
  let fixture: ComponentFixture<ViewDeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDeviceComponent]
    });
    fixture = TestBed.createComponent(ViewDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
