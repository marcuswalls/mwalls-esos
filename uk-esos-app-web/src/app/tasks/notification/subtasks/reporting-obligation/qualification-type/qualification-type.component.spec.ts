import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActivatedRouteStub } from '@testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { RequestTaskItemDTO } from 'esos-api';

import { QualificationTypeComponent } from './qualification-type.component';

/* eslint-disable @typescript-eslint/no-empty-function */
describe('QualificationTypeComponent', () => {
  let component: QualificationTypeComponent;
  let fixture: ComponentFixture<QualificationTypeComponent>;
  let store: RequestTaskStore;

  const user = userEvent.setup();
  const route = new ActivatedRouteStub();
  const taskService = {
    saveSubtask: () => {},
    payload: {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualificationTypeComponent],
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

    fixture = TestBed.createComponent(QualificationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show qualification type fields', () => {
    expect(yesRadio()).toBeVisible();
    expect(noRadio()).toBeVisible();
  });

  it('should show errors when no selection', async () => {
    await user.click(submitBtn());
    fixture.detectChanges();

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getAllByText(/Select an option/)).toHaveLength(2);
  });

  it('should save subtask when option selected', async () => {
    const submitSpy = jest.spyOn(taskService, 'saveSubtask');
    await user.click(yesRadio());
    fixture.detectChanges();

    await user.click(submitBtn());
    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalledWith({
      subtask: 'reportingObligation',
      currentStep: 'qualificationType',
      payload: {
        noc: {
          reportingObligation: {
            qualificationType: 'QUALIFY',
          },
        },
      },
      route,
      applySideEffects: false,
    });
  });

  function yesRadio() {
    return screen.getByRole('radio', {
      name: 'Yes, the organisation qualifies for ESOS and will submit a notification',
    });
  }

  function noRadio() {
    return screen.getByRole('radio', {
      name: 'No, the organisation does not qualify for ESOS and will not submit a notification',
    });
  }

  function submitBtn() {
    return screen.getByRole('button', { name: 'Save and continue' });
  }
});
