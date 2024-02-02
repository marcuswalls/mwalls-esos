import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EnergySavingsAchievedSummaryPageComponent } from '@shared/components/summaries';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('EnergySavingsAchievedSummaryPageComponent', () => {
  let component: EnergySavingsAchievedSummaryPageComponent;
  let fixture: ComponentFixture<EnergySavingsAchievedSummaryPageComponent>;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsAchievedSummaryPageComponent> {
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
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergySavingsAchievedSummaryPageComponent);
    component = fixture.componentInstance;

    component.wizardStep = {};
    component.data = {
      details: 'lorem ipsum',
      energySavingCategoriesExist: true,
      energySavingsCategories: {
        energyManagementPractices: 0,
        behaviourChangeInterventions: 0,
        training: 0,
        controlsImprovements: 0,
        shortTermCapitalInvestments: 0,
        longTermCapitalInvestments: 0,
        otherMeasures: 0,
        total: 0,
      },
      energySavingsEstimation: {
        buildings: 0,
        transport: 0,
        industrialProcesses: 0,
        otherProcesses: 0,
        total: 0,
      },
      energySavingsRecommendationsExist: true,
      energySavingsRecommendations: {
        energyAudits: 0,
        alternativeComplianceRoutes: 0,
        other: 0,
        total: 0,
      },
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      ['Buildings', '0 kWh'],
      ['Transport', '0 kWh'],
      ['Industrial processes', '0 kWh'],
      ['Other processes', '0 kWh'],
      ['Total', '0 kWh'],
      ['Yes'],
      ['Energy management practices', '0 kWh'],
      ['Behaviour change interventions', '0 kWh'],
      ['Training', '0 kWh'],
      ['Controls improvements', '0 kWh'],
      ['Short term capital investments (with payback period of less than 3 years)', '0 kWh'],
      ['Long term capital investments (with payback period of more than 3 years)', '0 kWh'],
      ['Other measures not covered by one of the above', '0 kWh'],
      ['Total', '0 kWh'],
      ['Yes'],
      ['Energy audits', '0 kWh'],
      ['Alternative compliance routes', '0 kWh'],
      ['Other', '0 kWh'],
      ['Total', '0 kWh'],
      ['lorem ipsum'],
    ]);
  });
});
