import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BasePage } from '@testing';

import { SharedModule } from '../../shared.module';
import { RelatedTasksComponent } from './related-tasks.component';

describe('RelatedTasksComponent', () => {
  let component: RelatedTasksComponent;
  let fixture: ComponentFixture<RelatedTasksComponent>;
  let page: Page;

  class Page extends BasePage<RelatedTasksComponent> {
    get heading() {
      return this.query('h2');
    }
    get items() {
      return this.queryAll('.govuk-heading-s').map((el) => el.textContent.trim());
    }
    get daysRemaining() {
      return this.queryAll('.govuk-body').map((el) => el.textContent.trim());
    }
    get links() {
      return this.queryAll<HTMLLinkElement>('a');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedTasksComponent);
    component = fixture.componentInstance;
    component.items = [
      {
        requestType: 'ORGANISATION_ACCOUNT_OPENING',
        taskType: 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW',
        taskId: 1,
        daysRemaining: 13,
      },
    ];
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display items', () => {
    expect(page.heading.textContent).toEqual('Related tasks');

    expect(page.items).toEqual(['Review organisation account application']);

    expect(page.daysRemaining).toEqual(['Days Remaining: 13']);

    expect(page.links.map((el) => el.getAttribute('href'))).toEqual(['/tasks/1']);
  });
});
