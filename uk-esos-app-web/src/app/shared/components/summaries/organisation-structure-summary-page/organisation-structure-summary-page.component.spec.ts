import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { OrganisationStructureSummaryPageComponent } from '@shared/components/summaries';
import { BasePage } from '@testing';

describe('OrganisationStructureSummaryPageComponent', () => {
  let component: OrganisationStructureSummaryPageComponent;
  let fixture: ComponentFixture<OrganisationStructureSummaryPageComponent>;
  let page: Page;

  const organisationStructure = {
    hasCeasedToBePartOfGroup: false,
    isPartOfArrangement: true,
    isPartOfFranchise: false,
    isTrust: true,
    organisationsAssociatedWithRU: [
      {
        hasCeasedToBePartOfGroup: true,
        isCoveredByThisNotification: true,
        isParentOfResponsibleUndertaking: true,
        isPartOfArrangement: true,
        isPartOfFranchise: false,
        isSubsidiaryOfResponsibleUndertaking: true,
        isTrust: false,
        organisationName: 'Organisation name',
      },
    ],
  };

  const route = new ActivatedRoute();
  route.snapshot = new ActivatedRouteSnapshot();
  route.snapshot.queryParams = { page: 1 };

  class Page extends BasePage<OrganisationStructureSummaryPageComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [row.querySelector('dt'), row.querySelectorAll('dd')[0]])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
    get table() {
      return this.query('.govuk-table');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: ActivatedRoute, useValue: route }] });
    fixture = TestBed.createComponent(OrganisationStructureSummaryPageComponent);
    component = fixture.componentInstance;
    component.vm = {
      subtaskName: 'organisationStructure',
      data: organisationStructure,
      isEditable: false,
      sectionsCompleted: { organisationStructure: 'COMPLETED' },
      wizardStep: {},
      organisationDetails: {
        city: 'City',
        county: 'Powys',
        line1: 'Line 1',
        line2: 'Line 2',
        name: 'Ru Org Name',
        postcode: 'Postcode',
      },
    };
    component.organisationStructure = signal(organisationStructure);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display summary details and list', () => {
    expect(page.summaryListValues).toEqual([
      [
        'Is the responsible undertaking part of an arrangement where 2 or more highest UK parent groups are complying as 1 participant?',
        'Yes',
      ],
      ['Is the responsible undertaking part of a franchise group?', 'No'],
      ['Is the responsible undertaking a trust?', 'Yes'],
      [
        'Has the responsible undertaking ceased to be a part of the corporate group between 31 December 2022 and 5 June 2024?',
        'No',
      ],
    ]);

    expect(page.table).toBeTruthy();
  });
});
