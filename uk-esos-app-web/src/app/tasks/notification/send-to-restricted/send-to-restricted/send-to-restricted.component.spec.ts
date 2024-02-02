import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { MockType } from '@testing';

import { TasksAssignmentService } from 'esos-api';
import { TasksService } from 'esos-api';

import { SendToRestrictedComponent } from './send-to-restricted.component';

describe('SendToRestrictedComponent', () => {
  let component: SendToRestrictedComponent;
  let fixture: ComponentFixture<SendToRestrictedComponent>;
  let mockStore: RequestTaskStore;
  let mockTasksAssignmentService: TasksAssignmentService;
  let mockTasksService: TasksService;
  let mockRouter: Router;
  let mockRoute: ActivatedRoute;

  beforeEach(async () => {
    mockStore = {
      select: jest.fn().mockReturnValue(() => of(1)),
    } as any;
    mockTasksAssignmentService = {
      getCandidateAssigneesByTaskType: jest
        .fn()
        .mockReturnValue(of([{ text: 'Restricted User', value: '7752ee-2321e-321552' }])),
    } as any;
    mockTasksService = {
      getTaskItemInfoById: jest.fn().mockReturnValue(of({ requestInfo: { id: 2 } })),
      processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
    } as any;
    mockRouter = {
      navigate: jest.fn(),
    } as any;
    mockRoute = {} as any;
    const taskService: MockType<NotificationService> = {
      returnToSubmit: jest.fn().mockImplementation(),
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: RequestTaskStore, useValue: mockStore },
        { provide: TasksAssignmentService, useValue: mockTasksAssignmentService },
        { provide: TasksService, useValue: mockTasksService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: TaskService, useValue: taskService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToRestrictedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the text of the option that matches the value', () => {
    const options = [
      { text: 'Restricted User', value: '7752ee-2321e-321552' },
      { text: 'Restricted User 2', value: '8152ee-2321e-321552' },
      { text: 'Restricted User 3', value: '9252ee-2321e-321552' },
    ];
    expect(component.getTextByValue(options, '8152ee-2321e-321552')).toBe('Restricted User 2');
    expect(component.getTextByValue(options, '')).toBe('');
  });
});
