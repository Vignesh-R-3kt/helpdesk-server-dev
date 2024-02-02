import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectTicketComponent } from './reject-ticket.component';

describe('RejectTicketComponent', () => {
  let component: RejectTicketComponent;
  let fixture: ComponentFixture<RejectTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectTicketComponent]
    });
    fixture = TestBed.createComponent(RejectTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
