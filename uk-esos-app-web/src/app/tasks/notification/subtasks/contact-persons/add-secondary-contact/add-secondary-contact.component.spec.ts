import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockContactPersons, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { NocP3 } from 'esos-api';

import { AddSecondaryContactComponent } from './add-secondary-contact.component';

describe('ContactPersonsAddSecondaryContactComponent', () => {
  let component: AddSecondaryContactComponent;
  let fixture: ComponentFixture<AddSecondaryContactComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          contactPersons: mockContactPersons,
        } as NocP3,
        nocSectionsCompleted: { contactPersons: 'IN_PROGRESS' },
      };
    },
  };

  class Page extends BasePage<AddSecondaryContactComponent> {
    get hasSecondaryContactRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="hasSecondaryContact"]');
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
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { contactPersons: { ...mockContactPersons, hasSecondaryContact: undefined } },
        { contactPersons: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(AddSecondaryContactComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and navigate to next route', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errors.map((error) => error.textContent.trim())).toEqual([
      'Select yes if you want to add a secondary contact',
    ]);
    expect(taskServiceSpy).not.toHaveBeenCalled();

    page.hasSecondaryContactRadios[0].click();
    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'contactPersons',
      currentStep: 'addSecondaryContact',
      route,
      payload: {
        noc: {
          contactPersons: mockContactPersons,
        },
        nocSectionsCompleted: { contactPersons: 'IN_PROGRESS' },
      },
    });
  });
});
