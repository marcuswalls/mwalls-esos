import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativeComplianceRoutesSummaryPageComponent } from '@shared/components/summaries';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { BasePage } from '@testing';

describe('AlternativeComplianceRoutesSummaryPageComponent', () => {
  let component: AlternativeComplianceRoutesSummaryPageComponent;
  let fixture: ComponentFixture<AlternativeComplianceRoutesSummaryPageComponent>;
  let page: Page;

  class Page extends BasePage<AlternativeComplianceRoutesSummaryPageComponent> {
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
      imports: [AlternativeComplianceRoutesSummaryPageComponent],
    });

    fixture = TestBed.createComponent(AlternativeComplianceRoutesSummaryPageComponent);
    component = fixture.componentInstance;

    component.alternativeComplianceRoutesMap = alternativeComplianceRoutesMap;
    component.data = {
      totalEnergyConsumptionReduction: 12,
      energyConsumptionReduction: {
        buildings: 1,
        transport: 5,
        industrialProcesses: 4,
        otherProcesses: 2,
        total: 12,
      },
      energyConsumptionReductionCategories: {
        energyManagementPractices: 1,
        behaviourChangeInterventions: 2,
        training: 3,
        controlsImprovements: 4,
        shortTermCapitalInvestments: 1,
        longTermCapitalInvestments: 0,
        otherMeasures: 1,
        total: 12,
      },
      assets: {
        iso50001: 'iso1',
        dec: 'dec1',
        gda: 'gda1',
      },
      iso50001CertificateDetails: {
        certificateNumber: 'iso1',
        validFrom: '2022-01-01T00:00:00.000Z',
        validUntil: '2024-01-01T00:00:00.000Z',
      },
      decCertificatesDetails: {
        certificateDetails: [
          {
            certificateNumber: 'dec1',
            validFrom: '2022-01-01T00:00:00.000Z',
            validUntil: '2024-01-01T00:00:00.000Z',
          },
          {
            certificateNumber: 'dec2',
            validFrom: '2020-01-01T00:00:00.000Z',
            validUntil: '2021-01-01T00:00:00.000Z',
          },
        ],
      },
      gdaCertificatesDetails: {
        certificateDetails: [
          {
            certificateNumber: 'gda1',
            validFrom: '2022-01-01T00:00:00.000Z',
            validUntil: '2024-01-01T00:00:00.000Z',
          },
          {
            certificateNumber: 'gda2',
            validFrom: '2020-01-01T00:00:00.000Z',
            validUntil: '2021-01-01T00:00:00.000Z',
          },
        ],
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
      `What is the total organisational potential annual reduction in energy consumption?`,
      `What is the organisational potential annual reduction in energy consumption in kWh from implementing all energy saving opportunities from alternative compliance routes?`,
      `What is the organisational potential annual reduction in energy consumption in kWh from implementing all energy saving opportunities from alternative compliance routes against the following energy saving categories?`,
      'List your assets and activities that fall under each alternative compliance route',
      'Provide details of your ISO 50001 certificate',
      'Provide details about your Display Energy Certificate (DECs)',
      'Provide details of your Green Deal Assessment',
    ]);
  });

  it('should display the table with added persons', () => {
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
