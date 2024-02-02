import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import OrganisationStructureComponent from '@timeline/notification/subtasks/organisation-structure/organisation-structure.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('OrganisationStructureComponent', () => {
  let component: OrganisationStructureComponent;
  let fixture: ComponentFixture<OrganisationStructureComponent>;
  let store: RequestActionStore;
  let page: Page;

  const route = new ActivatedRoute();
  route.snapshot = new ActivatedRouteSnapshot();
  route.snapshot.queryParams = { page: 1 };

  class Page extends BasePage<OrganisationStructureComponent> {
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
      providers: [RequestActionStore, { provide: ActivatedRoute, useValue: route }],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(OrganisationStructureComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
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
  });
});
