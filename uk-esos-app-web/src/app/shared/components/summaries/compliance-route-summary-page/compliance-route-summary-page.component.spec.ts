import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ComplianceRouteSummaryPageComponent } from '@shared/components/summaries';
import { ActivatedRouteStub, BasePage } from '@testing';

import { ComplianceRoute } from 'esos-api';

describe('ComplianceRouteSummaryPageComponent', () => {
  let component: ComplianceRouteSummaryPageComponent;
  let fixture: ComponentFixture<ComplianceRouteSummaryPageComponent>;
  let page: Page;

  const complianceRoute = {
    areDataEstimated: false,
    twelveMonthsVerifiableDataUsed: 'YES',
    energyConsumptionProfilingUsed: 'YES',
    areEnergyConsumptionProfilingMethodsRecorded: false,
    partsProhibitedFromDisclosingExist: false,
  } as ComplianceRoute;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<ComplianceRouteSummaryPageComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
    get headings() {
      return this.queryAll<HTMLHeadingElement>('h2').map((header) => header.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: ActivatedRoute, useValue: route }] });
    fixture = TestBed.createComponent(ComplianceRouteSummaryPageComponent);
    component = fixture.componentInstance;
    component.vm = {
      subtaskName: 'complianceRoute',
      data: complianceRoute,
      isEditable: false,
      sectionsCompleted: { complianceRoute: 'COMPLETED' },
      wizardStep: {},
    };
    component.complianceRoute = signal(complianceRoute);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display only the appropriate summary details according to the data', () => {
    expect(page.headings).toEqual([
      'Was the total energy consumption or spend calculated using any estimated data?',
      'Did this organisation use 12 months verifiable data for the purpose of calculating energy consumption in all of its ESOS energy audits?',
      'Did this organisation use energy consumption profiling for the purpose of analysing its energy consumption for all ESOS energy audits?',
      'Are the methods used for energy consumption profiling recorded in the evidence pack? (optional)',
      'Are there any parts of the ESOS report, or supporting information, that the responsible undertaking is prohibited from disclosing to any group undertaking?',
    ]);

    expect(page.summaries).toEqual(['No', 'Yes', 'Yes', 'No', 'No']);
  });
});
