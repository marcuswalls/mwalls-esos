import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { CountryService } from '@core/services/country.service';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  mockNotificationRequestTask,
  mockResponsibleUndertaking,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, CountryServiceStub, MockType } from '@testing';

import { OrganisationContactDetailsComponent } from './organisation-contact-details.component';

describe('OrganisationContactDetailsComponent', () => {
  let component: OrganisationContactDetailsComponent;
  let fixture: ComponentFixture<OrganisationContactDetailsComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          responsibleUndertaking: mockResponsibleUndertaking,
        } as any,
      };
    },
  };

  class Page extends BasePage<OrganisationContactDetailsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get email() {
      return this.getInputValue('#email');
    }

    set email(value: string) {
      this.setInputValue('#email', value);
    }

    get countryCode() {
      return this.getInputValue(this.query<HTMLSelectElement>('select[name="phoneNumber.countryCode"]'))['countryCode'];
    }

    get number() {
      return this.getInputValue(this.query<HTMLInputElement>('input[name="phoneNumber"]'));
    }

    set number(value: string) {
      this.setInputValue('input[name="phoneNumber"]', value);
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(OrganisationContactDetailsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestTaskStore,
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
        { provide: CountryService, useClass: CountryServiceStub },
      ],
    });
  });

  describe('for new organisation contact details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(mockNotificationRequestTask);
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(page.errorSummary).toBeFalsy();
      expect(page.heading1).toBeTruthy();
      expect(page.heading1.textContent.trim()).toEqual('Enter the organisation’s contact details');
      expect(page.submitButton).toBeTruthy();
    });

    it('should display error on empty form submit', () => {
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummaryListContents.length).toEqual(2);
      expect(page.errorSummaryListContents).toEqual(['Enter the email address', 'Enter both country code and number']);
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.email = 'user@test.com';
      page.number = '02071234567';

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'organisationContactDetails',
        route: route,
        payload: {
          noc: {
            responsibleUndertaking: {
              ...mockResponsibleUndertaking,
              organisationContactDetails: {
                email: 'user@test.com',
                phoneNumber: {
                  countryCode: '44',
                  number: '02071234567',
                },
              },
            },
          },
        },
      });
    });
  });

  describe('for existing organisation contact details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { responsibleUndertaking: mockResponsibleUndertaking },
          { responsibleUndertaking: TaskItemStatus.IN_PROGRESS },
        ),
      );
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(page.errorSummary).toBeFalsy();
      expect(page.heading1).toBeTruthy();
      expect(page.heading1.textContent.trim()).toEqual('Enter the organisation’s contact details');
      expect(page.email).toEqual('1@o.com');
      expect(page.countryCode).toEqual('44');
      expect(page.number).toEqual('02071234567');
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: 'responsibleUndertaking',
        currentStep: 'organisationContactDetails',
        route: route,
        payload: {
          noc: {
            responsibleUndertaking: mockResponsibleUndertaking,
          },
        },
      });
    });
  });
});
