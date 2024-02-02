import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import ConfirmationComponent from '@timeline/notification/subtasks/confirmation/confirmation.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<ConfirmationComponent> {
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

    fixture = TestBed.createComponent(ConfirmationComponent);
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
        "has reviewed the recommendations of your organisation's ESOS assessment or alternative routes to compliance (e.g. ISO 50001)",
        'Yes',
      ],
      ['is satisfied, to the best of their knowledge, that the organisation is within the scope of the scheme', 'Yes'],
      ['is satisfied, to the best of their knowledge, that the organisation is compliant with the scheme', 'Yes'],
      [
        'is satisfied, to the best of their knowledge, that relevant sections of the ESOS report, and supporting information where relevant, have been shared with all undertakings in the corporate group, unless there is a declared reason why this is prohibited by law',
        'Yes',
      ],
      [
        'is satisfied, to the best of their knowledge, that the information provided in this notification is correct',
        'Yes',
      ],
      ['is satisfied, to the best of their knowledge, that the organisation is within the scope of the scheme', 'Yes'],
      ['is satisfied, to the best of their knowledge, that the organisation is compliant with the scheme', 'Yes'],
      [
        'is satisfied, to the best of their knowledge, that the information provided in this notification is correct',
        'Yes',
      ],
      ['First name', 'John'],
      ['Last name', 'Doe'],
      ['Job title', 'Job title'],
      ['Email address', ''],

      ['Address', 'Line'],
      ['Town or city', 'City'],
      ['County', 'County'],
      ['Postcode', 'Postcode'],
      ['Phone number 1', 'UK (44) 1234567890'],
      ['Phone number 2', ''],

      ['2 Feb 2022', ''],
      [
        "has reviewed the recommendations of your organisation's ESOS assessment or alternative routes to compliance (e.g. ISO 50001)",
        'Yes',
      ],
      ['is satisfied, to the best of their knowledge, that the organisation is within the scope of the scheme', 'Yes'],
      ['is satisfied, to the best of their knowledge, that the organisation is compliant with the scheme', 'Yes'],
      [
        'Is satisfied, to the best of their knowledge, that relevant sections of the ESOS report, and supporting information where relevant, have been shared with all undertakings in the corporate group, unless there is a declared reason why this is prohibited by law',
        'Yes',
      ],
      [
        'is satisfied, to the best of their knowledge, that the information provided in this notification is correct',
        'Yes',
      ],
      ['First name', 'Jane'],
      ['Last name', 'Doe'],
      ['Job title', 'Job title'],
      ['Email address', ''],

      ['Address', 'Line'],
      ['Town or city', 'City'],
      ['County', 'County'],
      ['Postcode', 'Postcode'],
      ['Phone number 1', 'UK (44) 1234567890'],
      ['Phone number 2', ''],
    ]);
  });
});
