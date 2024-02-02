import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import { CurrentStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { CompliancePeriodSummaryComponent } from '@tasks/notification/subtasks/compliance-periods/shared/summary/summary.component';
import {
  mockFirstCompliancePeriod,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { NocP3 } from 'esos-api';

describe('CompliancePeriodSummaryComponent', () => {
  let component: CompliancePeriodSummaryComponent;
  let fixture: ComponentFixture<CompliancePeriodSummaryComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
          firstCompliancePeriod: mockFirstCompliancePeriod,
        } as NocP3,
        nocSectionsCompleted: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
          firstCompliancePeriod: TaskItemStatus.IN_PROGRESS,
        },
      };
    },
  };

  class Page extends BasePage<CompliancePeriodSummaryComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: TaskService, useValue: taskService },
        { provide: COMPLIANCE_PERIOD_SUB_TASK, useValue: CompliancePeriodSubtask.FIRST },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { firstCompliancePeriod: mockFirstCompliancePeriod },
        { firstCompliancePeriod: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(CompliancePeriodSummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and navigate to add task list page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: CompliancePeriodSubtask.FIRST,
      currentStep: CurrentStep.SUMMARY,
      route: activatedRoute,
      payload: {
        noc: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
          firstCompliancePeriod: mockFirstCompliancePeriod,
        } as NocP3,
        nocSectionsCompleted: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
          firstCompliancePeriod: TaskItemStatus.IN_PROGRESS,
        },
      },
    });
  });
});
