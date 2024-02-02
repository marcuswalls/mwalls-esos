import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import EnergySavingsOpportunitiesComponent from '@timeline/notification/subtasks/energy-savings-opportunities/energy-savings-opportunities.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('EnergySavingsOpportunitiesComponent', () => {
  let component: EnergySavingsOpportunitiesComponent;
  let fixture: ComponentFixture<EnergySavingsOpportunitiesComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<EnergySavingsOpportunitiesComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestActionStore],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(EnergySavingsOpportunitiesComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      ['Buildings', '2 kWh'],
      ['Transport', '4 kWh'],
      ['Industrial processes', '9 kWh'],
      ['Other processes', '13 kWh'],
      ['Total', '28 kWh'],
      ['Energy management practices', '1 kWh'],
      ['Behaviour change interventions', '2 kWh'],
      ['Training', '3 kWh'],
      ['Controls improvements', '4 kWh'],
      ['Short term capital investments (with a payback period of less than 3 years)', '5 kWh'],
      ['Long term capital investments (with a payback period of less than 3 years)', '6 kWh'],
      ['Other measures not covered by one of the above', '7 kWh'],
      ['Total', '28 kWh', ''],
    ]);
  });
});
