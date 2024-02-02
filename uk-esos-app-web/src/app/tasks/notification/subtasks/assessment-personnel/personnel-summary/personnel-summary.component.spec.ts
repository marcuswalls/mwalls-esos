import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  mockAssessmentPersonnel,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { NocP3 } from 'esos-api';

import { ASSESSMENT_PERSONNEL_SUB_TASK, AssessmentPersonnelCurrentStep } from '../assessment-personnel.helper';
import PersonnelSummaryComponent from './personnel-summary.component';

describe('PersonnelSummaryComponent', () => {
  let component: PersonnelSummaryComponent;
  let fixture: ComponentFixture<PersonnelSummaryComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
          assessmentPersonnel: mockAssessmentPersonnel,
        } as NocP3,
        nocSectionsCompleted: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
          assessmentPersonnel: TaskItemStatus.IN_PROGRESS,
        },
      };
    },
  };

  class Page extends BasePage<PersonnelSummaryComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [PersonnelSummaryComponent, RouterTestingModule],
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: TaskService, useValue: taskService },
        { provide: TaskService, useValue: taskService },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { assessmentPersonnel: mockAssessmentPersonnel },
        { assessmentPersonnel: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(PersonnelSummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and navigate to task list page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: ASSESSMENT_PERSONNEL_SUB_TASK,
      currentStep: AssessmentPersonnelCurrentStep.SUMMARY,
      route: activatedRoute,
      payload: {
        noc: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
          assessmentPersonnel: mockAssessmentPersonnel,
        } as NocP3,
        nocSectionsCompleted: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
          assessmentPersonnel: TaskItemStatus.IN_PROGRESS,
        },
      },
    });
  });
});
