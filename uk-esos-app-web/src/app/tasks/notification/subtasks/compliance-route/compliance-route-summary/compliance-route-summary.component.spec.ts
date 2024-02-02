import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockComplianceRoute, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { ComplianceRouteSummaryComponent } from './compliance-route-summary.component';

describe('ComplianceRouteSummaryComponent', () => {
  let component: ComplianceRouteSummaryComponent;
  let fixture: ComponentFixture<ComplianceRouteSummaryComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    submitSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          complianceRoute: mockComplianceRoute,
        } as any,
        nocSectionsCompleted: { complianceRoute: 'COMPLETED' },
      };
    },
  };

  class Page extends BasePage<ComplianceRouteSummaryComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild({ complianceRoute: mockComplianceRoute }, { complianceRoute: 'IN_PROGRESS' as any }));

    fixture = TestBed.createComponent(ComplianceRouteSummaryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and navigate to list page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'complianceRoute',
      currentStep: 'summary',
      route,
      payload: {
        noc: {
          complianceRoute: mockComplianceRoute,
        },
        nocSectionsCompleted: { complianceRoute: 'COMPLETED' },
      },
    });
  });
});
