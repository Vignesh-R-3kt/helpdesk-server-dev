import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserTicketComponent } from './view-user-ticket.component';

describe('ViewUserTicketComponent', () => {
  let component: ViewUserTicketComponent;
  let fixture: ComponentFixture<ViewUserTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUserTicketComponent]
    });
    fixture = TestBed.createComponent(ViewUserTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
