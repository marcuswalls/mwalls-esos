import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  mockEnergySavingsAchieved,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { NocP3 } from 'esos-api';

import { ENERGY_SAVINGS_ACHIEVED_SUB_TASK, EnergySavingsAchievedCurrentStep } from '../energy-savings-achieved.helper';
import EnergySavingsAchievedSummaryComponent from './energy-savings-achieved-summary.component';

describe('EnergySavingsAchievedSummaryComponent', () => {
  let component: EnergySavingsAchievedSummaryComponent;
  let fixture: ComponentFixture<EnergySavingsAchievedSummaryComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
          energySavingsAchieved: mockEnergySavingsAchieved,
        } as NocP3,
        nocSectionsCompleted: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
          energySavingsAchieved: TaskItemStatus.IN_PROGRESS,
        },
      };
    },
  };

  class Page extends BasePage<EnergySavingsAchievedSummaryComponent> {
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
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { energySavingsAchieved: mockEnergySavingsAchieved },
        { energySavingsAchieved: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(EnergySavingsAchievedSummaryComponent);
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
      subtask: ENERGY_SAVINGS_ACHIEVED_SUB_TASK,
      currentStep: EnergySavingsAchievedCurrentStep.SUMMARY,
      route: activatedRoute,
      payload: {
        noc: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
          energySavingsAchieved: mockEnergySavingsAchieved,
        } as NocP3,
        nocSectionsCompleted: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
          energySavingsAchieved: TaskItemStatus.IN_PROGRESS,
        },
      },
    });
  });
});
