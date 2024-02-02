import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockContactPersons, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { ContactPersons, NocP3 } from 'esos-api';

import { PrimaryContactDetailsComponent } from './primary-contact-details.component';

describe('ContactPersonsPrimaryDetailsComponent', () => {
  let component: PrimaryContactDetailsComponent;
  let fixture: ComponentFixture<PrimaryContactDetailsComponent>;
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

  class Page extends BasePage<PrimaryContactDetailsComponent> {
    set email(value: string) {
      this.setInputValue('#email', value);
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
        HttpClient,
        HttpHandler,
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { contactPersons: mockContactPersons },
        {
          contactPersons: TaskItemStatus.IN_PROGRESS,
        },
      ),
    );

    fixture = TestBed.createComponent(PrimaryContactDetailsComponent);
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
    expect(page.errors.map((error) => error.textContent.trim())).toEqual(['Enter email address']);
    expect(taskServiceSpy).not.toHaveBeenCalled();

    page.email = 'johndoe@mail.com';
    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'contactPersons',
      currentStep: 'primaryContact',
      route,
      payload: {
        noc: {
          contactPersons: {
            ...mockContactPersons,
            primaryContact: { ...mockContactPersons.primaryContact, email: 'johndoe@mail.com' },
          } as ContactPersons,
        },
        nocSectionsCompleted: { contactPersons: 'IN_PROGRESS' },
      },
    });
  });
});
