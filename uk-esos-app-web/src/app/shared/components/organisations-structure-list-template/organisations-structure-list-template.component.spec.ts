import { computed } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { BasePage } from '@testing';

import { OrganisationStructureListTableComponent } from './organisations-structure-list-template.component';

describe('ListTableComponent', () => {
  let component: OrganisationStructureListTableComponent;
  let fixture: ComponentFixture<OrganisationStructureListTableComponent>;
  let page: Page;

  const route = new ActivatedRoute();
  route.snapshot = new ActivatedRouteSnapshot();
  route.snapshot.queryParams = { page: 1 };

  class Page extends BasePage<OrganisationStructureListTableComponent> {
    get organisationsTable() {
      return this.query('.govuk-table');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: ActivatedRoute, useValue: route }] });

    fixture = TestBed.createComponent(OrganisationStructureListTableComponent);
    component = fixture.componentInstance;
    component.vm = {
      header: 'Header',
      isListPreviousPage: true,
      wizardStep: {},
      isEditable: false,
      organisationDetails: {
        city: 'City',
        county: 'Powys',
        line1: 'Line 1',
        line2: 'Line 2',
        name: 'Ru Org Name',
        postcode: 'Postcode',
      },
    };
    component.organisationStructure = computed(() => ({
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
    }));
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading text', () => {
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-m'));
    expect(headingElement.nativeElement.textContent).toBe('Header');
  });

  it('should display the table with organisations', () => {
    const cells = Array.from(page.organisationsTable.querySelectorAll('td'));

    expect(cells.map((cell) => cell.textContent.trim())).toEqual([
      ...['Ru Org Name  Responsible undertaking', '✓', '✓', '', '', '', '✓', '', ''],
      ...['Organisation name', '✓', '✓', '✓', '✓', '', '', '✓', ''],
    ]);
  });
});
