import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import AlternativeComplianceRoutesComponent from '@timeline/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('AlternativeComplianceRoutesComponent', () => {
  let component: AlternativeComplianceRoutesComponent;
  let fixture: ComponentFixture<AlternativeComplianceRoutesComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<AlternativeComplianceRoutesComponent> {
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

    fixture = TestBed.createComponent(AlternativeComplianceRoutesComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      ['12 kWh'],
      ['Buildings', '1 kWh'],
      ['Transport', '5 kWh'],
      ['Industrial processes', '4 kWh'],
      ['Other processes', '2 kWh'],
      ['Total', '12 kWh'],
      ['Energy management practices', '1 kWh'],
      ['Behaviour change interventions', '2 kWh'],
      ['Training', '3 kWh'],
      ['Controls improvements', '4 kWh'],
      ['Short term capital investments (with a payback period of less than 3 years)', '1 kWh'],
      ['Long term capital investments (with a payback period of less than 3 years)', '0 kWh'],
      ['Other measures not covered by one of the above', '1 kWh'],
      ['Total', '12 kWh', ''],
      ['ISO 50001', 'iso1'],
      ['Display Energy Certificate (DECs)', 'dec1'],
      ['Green Deal Assessment', 'gda1'],
      ['Certificate number', 'iso1'],
      ['Valid from', '1 Jan 2022'],
      ['Valid until', '1 Jan 2024'],
    ]);
  });
});
