import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMailComponent } from './review-mail.component';

describe('ReviewMailComponent', () => {
  let component: ReviewMailComponent;
  let fixture: ComponentFixture<ReviewMailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewMailComponent]
    });
    fixture = TestBed.createComponent(ReviewMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
