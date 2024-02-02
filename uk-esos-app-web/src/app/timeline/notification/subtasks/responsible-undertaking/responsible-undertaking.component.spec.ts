import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import ResponsibleUndertakingComponent from '@timeline/notification/subtasks/responsible-undertaking/responsible-undertaking.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('ResponsibleUndertakingComponent', () => {
  let component: ResponsibleUndertakingComponent;
  let fixture: ComponentFixture<ResponsibleUndertakingComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<ResponsibleUndertakingComponent> {
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

    fixture = TestBed.createComponent(ResponsibleUndertakingComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      ['Organisation name', 'Corporate Legal Entity Account 2'],
      ['Registration number', '111111'],
      ['Address line 1', 'Some address 1'],
      ['Address line 2', 'Some address 2'],
      ['Town or city', 'London'],
      ['County', 'London'],
      ['Postcode', '511111'],
      ['Yes  Trading name', ''],
      ['Email address', '1@o.com'],
      ['Telephone number', '44 02071234567'],
      ['Yes', ''],
      ['Parent company name', 'Parent company name'],
      ['Parent company trading name', 'Parent company trading name'],
    ]);
  });
});
