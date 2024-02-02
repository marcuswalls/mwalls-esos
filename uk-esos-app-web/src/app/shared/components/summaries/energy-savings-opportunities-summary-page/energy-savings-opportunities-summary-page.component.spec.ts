import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergySavingsOpportunitiesSummaryPageComponent } from '@shared/components/summaries';
import { BasePage } from '@testing';

describe('EnergySavingsOpportunitiesSummaryPageComponent', () => {
  let component: EnergySavingsOpportunitiesSummaryPageComponent;
  let fixture: ComponentFixture<EnergySavingsOpportunitiesSummaryPageComponent>;
  let page: Page;

  class Page extends BasePage<EnergySavingsOpportunitiesSummaryPageComponent> {
    get headers() {
      return this.queryAll<HTMLHeadElement>('h2').map((el) => el?.textContent?.trim());
    }
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
      imports: [EnergySavingsOpportunitiesSummaryPageComponent],
    });

    fixture = TestBed.createComponent(EnergySavingsOpportunitiesSummaryPageComponent);
    component = fixture.componentInstance;

    component.changeLink = {
      STEP1: 'step-1',
      STEP2: 'step-2',
    };
    component.data = {
      energyConsumption: {
        buildings: 2,
        transport: 4,
        industrialProcesses: 9,
        otherProcesses: 13,
        total: 28,
      },
      energySavingsCategories: {
        energyManagementPractices: 1,
        behaviourChangeInterventions: 2,
        training: 3,
        controlsImprovements: 4,
        shortTermCapitalInvestments: 5,
        longTermCapitalInvestments: 6,
        otherMeasures: 7,
        total: 28,
      },
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the headers', () => {
    expect(page.headers).toEqual([
      `What is an estimate of the potential annual reduction in energy consumption in kWh which could be achieved as a result of implementing all energy saving opportunities identified through energy audits?`,
      `What is an estimate of the potential annual reduction in energy consumption in kWh which could be achieved as a result of implementing all energy saving opportunities against the following energy saving categories identified through energy audits?`,
    ]);
  });

  it('should display the table with added persons', () => {
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
