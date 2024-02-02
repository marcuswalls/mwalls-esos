import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import { mockSecondCompliancePeriod, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage } from '@testing';

import { ReductionAchievedExistsComponent } from './reduction-achieved-exists.component';

describe('ReductionAchievedExistsComponent', () => {
  let component: ReductionAchievedExistsComponent;
  let fixture: ComponentFixture<ReductionAchievedExistsComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  class Page extends BasePage<ReductionAchievedExistsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get reductionAchievedExists() {
      return this.query('div[govuk-radio]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideNotificationTaskServices(),
        provideNotificationSideEffects(),
        provideNotificationStepFlowManagers(),
        RequestTaskStore,
        SideEffectsHandler,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: COMPLIANCE_PERIOD_SUB_TASK, useValue: CompliancePeriodSubtask.SECOND },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { secondCompliancePeriod: mockSecondCompliancePeriod },
        { secondCompliancePeriod: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(ReductionAchievedExistsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading the form field', () => {
    expect(page.heading1.textContent.trim()).toEqual(WIZARD_STEP_HEADINGS['reduction-achieved-exists'](true));

    expect(page.reductionAchievedExists).toBeTruthy();
  });
});
