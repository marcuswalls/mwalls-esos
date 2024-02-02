import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import AssessmentPersonnelComponent from '@timeline/notification/subtasks/assessment-personnel/assessment-personnel.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('AssessmentPersonnelComponent', () => {
  let component: AssessmentPersonnelComponent;
  let fixture: ComponentFixture<AssessmentPersonnelComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<AssessmentPersonnelComponent> {
    get rows() {
      return this.queryAll<HTMLTableRowElement>('govuk-table tr')
        .filter((el) => !el.querySelector('th'))
        .map((el) => Array.from(el.querySelectorAll('td')).map((td) => td.textContent.trim()));
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

    fixture = TestBed.createComponent(AssessmentPersonnelComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.rows).toEqual([
      ['John Doe', 'Internal', ''],
      ['John Smith', 'External', ''],
    ]);
  });
});
