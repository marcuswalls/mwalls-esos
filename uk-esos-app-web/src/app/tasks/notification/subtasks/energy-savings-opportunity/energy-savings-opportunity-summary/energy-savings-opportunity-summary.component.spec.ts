import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import { mockEnergySavingOpportunities, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { TasksService } from 'esos-api';

import { EnergySavingsOpportunitySummaryComponent } from './energy-savings-opportunity-summary.component';

describe('EnergySavingsOpportunitySummaryComponent', () => {
  let component: EnergySavingsOpportunitySummaryComponent;
  let fixture: ComponentFixture<EnergySavingsOpportunitySummaryComponent>;

  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  const seState = () => {
    store.setState(
      mockStateBuild(
        { energySavingsOpportunities: { ...mockEnergySavingOpportunities } },
        { energySavingsOpportunities: TaskItemStatus.IN_PROGRESS },
      ),
    );
  };

  class Page extends BasePage<EnergySavingsOpportunitySummaryComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [row.querySelector('dt'), row.querySelectorAll('dd')[0], row.querySelectorAll('dd')[1]])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNotificationTaskServices(),
        provideNotificationSideEffects(),
        provideNotificationStepFlowManagers(),
        RequestTaskStore,
        SideEffectsHandler,
        { provide: ActivatedRoute, useValue: route },
        { provide: TasksService, useValue: tasksService },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    seState();

    fixture = TestBed.createComponent(EnergySavingsOpportunitySummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the summary details', () => {
    expect(page.summaryListValues).toEqual([
      ['Buildings', '2 kWh', 'Change'],
      ['Transport', '4 kWh', 'Change'],
      ['Industrial processes', '9 kWh', 'Change'],
      ['Other processes', '13 kWh', 'Change'],
      ['Total', '28 kWh'],

      ['Energy management practices', '1 kWh', 'Change'],
      ['Behaviour change interventions', '2 kWh', 'Change'],
      ['Training', '3 kWh', 'Change'],
      ['Controls improvements', '4 kWh', 'Change'],
      ['Short term capital investments (with a payback period of less than 3 years)', '5 kWh', 'Change'],
      ['Long term capital investments (with a payback period of less than 3 years)', '6 kWh', 'Change'],
      ['Other measures not covered by one of the above', '7 kWh', 'Change'],
      ['Total', '28 kWh', ''],
    ]);
  });
});
