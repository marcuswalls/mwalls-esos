import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockConfirmations, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, MockType } from '@testing';
import { screen } from '@testing-library/dom';

import ResponsibleOfficerDetailsComponent from './responsible-officer-details.component';

describe('ResponsibleOfficerDetailsComponent', () => {
  let component: ResponsibleOfficerDetailsComponent;
  let fixture: ComponentFixture<ResponsibleOfficerDetailsComponent>;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          confirmations: mockConfirmations,
        } as any,
      };
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestTaskStore,
        HttpClient,
        HttpHandler,
        { provide: TaskService, useValue: taskService },
        {
          provide: ActivatedRoute,
          useValue: route,
        },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild({ confirmations: mockConfirmations }, { confirmations: TaskItemStatus.IN_PROGRESS }));
    fixture = TestBed.createComponent(ResponsibleOfficerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct form labels', () => {
    expect(screen.getByText('Details of the responsible officer')).toBeInTheDocument();
  });
});
