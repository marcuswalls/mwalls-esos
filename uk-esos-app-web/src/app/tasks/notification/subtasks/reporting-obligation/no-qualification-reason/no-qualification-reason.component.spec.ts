import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActivatedRouteStub } from '@testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { RequestTaskItemDTO } from 'esos-api';

import { NoQualificationReasonComponent } from './no-qualification-reason.component';

/* eslint-disable @typescript-eslint/no-empty-function */
describe('NoQualificationReasonComponent', () => {
  let component: NoQualificationReasonComponent;
  let fixture: ComponentFixture<NoQualificationReasonComponent>;
  let store: RequestTaskStore;

  const user = userEvent.setup();
  const route = new ActivatedRouteStub();
  const taskService = {
    saveSubtask: () => {},
    payload: { noc: { reportingObligation: {} } },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoQualificationReasonComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setIsEditable(true);
    store.setRequestTaskItem({
      requestTask: { payload: { noc: {} } },
    } as Partial<RequestTaskItemDTO>);

    fixture = TestBed.createComponent(NoQualificationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show noQualification reason field', () => {
    expect(reasonField()).toBeVisible();
  });

  it('should show errors when no reason', async () => {
    await user.click(submitBtn());
    fixture.detectChanges();

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getAllByText(/Enter a reason/)).toHaveLength(2);
  });

  it('should save subtask when reason provided', async () => {
    const submitSpy = jest.spyOn(taskService, 'saveSubtask');
    await user.type(reasonField(), 'Whatever reason');
    fixture.detectChanges();

    await user.click(submitBtn());
    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalledWith({
      subtask: 'reportingObligation',
      currentStep: 'noQualificationReason',
      payload: {
        noc: {
          reportingObligation: {
            noQualificationReason: 'Whatever reason',
          },
        },
      },
      route,
      applySideEffects: false,
    });
  });

  function reasonField() {
    return screen.getByRole('textbox');
  }

  function submitBtn() {
    return screen.getByRole('button', { name: 'Save and continue' });
  }
});
