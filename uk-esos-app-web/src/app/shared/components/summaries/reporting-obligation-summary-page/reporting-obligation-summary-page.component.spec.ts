import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingObligationSummaryPageComponent } from '@shared/components/summaries';

describe('ReportingObligationSummaryPageComponent', () => {
  let component: ReportingObligationSummaryPageComponent;
  let fixture: ComponentFixture<ReportingObligationSummaryPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReportingObligationSummaryPageComponent],
    });
    fixture = TestBed.createComponent(ReportingObligationSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
