import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@common/request-action/+state';
import { ActivatedRouteStub, BasePage } from '@testing';
import SecondCompliancePeriodComponent from '@timeline/notification/subtasks/second-compliance-period/second-compliance-period.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('SecondCompliancePeriodComponent', () => {
  let component: SecondCompliancePeriodComponent;
  let fixture: ComponentFixture<SecondCompliancePeriodComponent>;
  let store: RequestActionStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<SecondCompliancePeriodComponent> {
    get summaryColumnValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__column')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestActionStore, { provide: ActivatedRoute, useValue: route }],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(SecondCompliancePeriodComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary column values', () => {
    expect(page.summaryColumnValues).toEqual([['No']]);
  });
});
