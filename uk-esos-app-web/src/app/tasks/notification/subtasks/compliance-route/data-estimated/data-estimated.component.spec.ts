import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import {
  mockComplianceRoute,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskActionPayload, TasksService } from 'esos-api';

import { DataEstimatedComponent } from './data-estimated.component';

describe('DataEstimatedComponent', () => {
  let component: DataEstimatedComponent;
  let fixture: ComponentFixture<DataEstimatedComponent>;
  let store: RequestTaskStore;
  let router: Router;
  let page: Page;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  const setState = (areDataEstimated?: boolean) => {
    store.setState(
      mockStateBuild(
        { complianceRoute: { ...mockComplianceRoute, areDataEstimated } },
        { complianceRoute: TaskItemStatus.IN_PROGRESS },
      ),
    );
  };

  class Page extends BasePage<DataEstimatedComponent> {
    get areDataEstimatedRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="areDataEstimated"]');
    }
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
    get errorSummary() {
      return this.query<HTMLDivElement>('govuk-error-summary');
    }
    get errors() {
      return this.queryAll<HTMLLIElement>('ul.govuk-error-summary__list > li');
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
    setState();

    fixture = TestBed.createComponent(DataEstimatedComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show errors', () => {
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errors.map((error) => error.textContent.trim())).toEqual(['Select an option']);
    expect(tasksService.processRequestTaskAction).not.toHaveBeenCalled();
  });

  it('should submit and navigate to next page', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    page.areDataEstimatedRadios[0].click();
    page.submitButton.click();
    setState(true);
    delete mockComplianceRoute.twelveMonthsVerifiableDataUsed;
    fixture.detectChanges();

    expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith({
      requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
      requestTaskId: 2,
      requestTaskActionPayload: {
        payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
        noc: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
          complianceRoute: { ...mockComplianceRoute, areDataEstimated: true },
        },
        nocSectionsCompleted: {
          ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
          complianceRoute: 'IN_PROGRESS',
        },
      } as RequestTaskActionPayload,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['../estimation-methods-recorded'], { relativeTo: route });
  });
});
