import { computed } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { BasePage } from '@testing';

import { EnergyAuditListComponent } from './energy-audit-list.component';

describe('EnergyAuditListComponent', () => {
  let component: EnergyAuditListComponent;
  let fixture: ComponentFixture<EnergyAuditListComponent>;
  let page: Page;

  const route = new ActivatedRoute();

  class Page extends BasePage<EnergyAuditListComponent> {
    get organisationsTable() {
      return this.query('.govuk-table');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: ActivatedRoute, useValue: route }] });

    fixture = TestBed.createComponent(EnergyAuditListComponent);
    component = fixture.componentInstance;
    component.vm = {
      header: 'Energy audits added',
      prefix: '../',
      wizardStep: {},
      isEditable: false,
    };
    component.complianceRoute = computed(() => ({
      areDataEstimated: false,
      twelveMonthsVerifiableDataUsed: 'YES',
      energyConsumptionProfilingUsed: 'NOT_APPLICABLE',
      energyAudits: [
        {
          description: 'desc1',
          numberOfSitesCovered: 5,
          numberOfSitesVisited: 10,
          reason: 'reason1',
        },
        {
          description: 'desc2',
          numberOfSitesCovered: 999,
          numberOfSitesVisited: 999,
          reason: 'reason2',
        },
      ],
      partsProhibitedFromDisclosingExist: true,
      partsProhibitedFromDisclosing: 'parts',
      partsProhibitedFromDisclosingReason: 'reason',
    }));
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading text', () => {
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-m'));
    expect(headingElement.nativeElement.textContent).toBe('Energy audits added');
  });

  it('should display the table with values', () => {
    const cells = Array.from(page.organisationsTable.querySelectorAll('td'));

    expect(cells.map((cell) => cell.textContent.trim())).toEqual([
      ...['1', 'desc1', '5', '10', 'reason1', ''],
      ...['2', 'desc2', '999', '999', 'reason2', ''],
    ]);
  });
});
