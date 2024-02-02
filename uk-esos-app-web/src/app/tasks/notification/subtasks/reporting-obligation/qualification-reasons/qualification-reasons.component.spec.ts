import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActivatedRouteStub } from '@testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { RequestTaskItemDTO } from 'esos-api';

import { QualificationReasonsComponent } from './qualification-reasons.component';

/* eslint-disable @typescript-eslint/no-empty-function */
describe('QualificationReasonsComponent', () => {
  let component: QualificationReasonsComponent;
  let fixture: ComponentFixture<QualificationReasonsComponent>;
  let store: RequestTaskStore;

  const user = userEvent.setup();
  const route = new ActivatedRouteStub();
  const taskService = {
    saveSubtask: () => {},
    payload: {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualificationReasonsComponent],
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

    fixture = TestBed.createComponent(QualificationReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show qualification type fields', () => {
    expect(turnoverMoreThan44mCheckbox()).toBeVisible();
    expect(staffMembersMoreThan250Checkbox()).toBeVisible();
  });

  it('should show errors when no selection', async () => {
    await user.click(submitBtn());
    fixture.detectChanges();

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getAllByText(/Select at least one reason/)).toHaveLength(2);
  });

  function turnoverMoreThan44mCheckbox() {
    return screen.getByRole('checkbox', { name: /The annual turnover is over/ });
  }

  function staffMembersMoreThan250Checkbox() {
    return screen.getByRole('checkbox', { name: /The organisation has over 250 members of staff/ });
  }

  function submitBtn() {
    return screen.getByRole('button', { name: 'Save and continue' });
  }
});
