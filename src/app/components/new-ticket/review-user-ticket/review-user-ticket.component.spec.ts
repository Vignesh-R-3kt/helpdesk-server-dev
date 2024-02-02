import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewUserTicketComponent } from './review-user-ticket.component';

describe('ReviewUserTicketComponent', () => {
  let component: ReviewUserTicketComponent;
  let fixture: ComponentFixture<ReviewUserTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewUserTicketComponent]
    });
    fixture = TestBed.createComponent(ReviewUserTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
