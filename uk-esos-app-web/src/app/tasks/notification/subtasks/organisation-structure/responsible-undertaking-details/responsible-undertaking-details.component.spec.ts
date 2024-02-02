import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockOrganisationStructure, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { ResponsibleUndertakingDetailsComponent } from './responsible-undertaking-details.component';

describe('ResponsibleUndertakingDetailsComponent', () => {
  let component: ResponsibleUndertakingDetailsComponent;
  let fixture: ComponentFixture<ResponsibleUndertakingDetailsComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          organisationStructure: mockOrganisationStructure,
        } as any,
        nocSectionsCompleted: { organisationStructure: 'IN_PROGRESS' },
      };
    },
  };

  class Page extends BasePage<ResponsibleUndertakingDetailsComponent> {
    get isPartOfArrangementRadio() {
      return this.queryAll<HTMLInputElement>('input[name$="isPartOfArrangement"]');
    }
    get isPartOfFranchiseRadio() {
      return this.queryAll<HTMLInputElement>('input[name$="isPartOfFranchise"]');
    }
    get isTrustRadio() {
      return this.queryAll<HTMLInputElement>('input[name$="isTrust"]');
    }
    get hasCeasedToBePartOfGroupRadio() {
      return this.queryAll<HTMLInputElement>('input[name$="hasCeasedToBePartOfGroup"]');
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
    store.setState(mockStateBuild({ organisationStructure: {} }, { organisationStructure: 'IN_PROGRESS' as any }));

    fixture = TestBed.createComponent(ResponsibleUndertakingDetailsComponent);
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
      'Select yes if the responsible undertaking has 2 or more parent groups complying as 1 participant',
      'Select yes if the responsible undertaking is part of a franchise group',
      'Select yes if the responsible undertaking is a trust',
      'Select yes if the responsible undertaking ceased to be part of the corporate group between 31 December 2022 and 5 June 2024',
    ]);
    expect(taskServiceSpy).not.toHaveBeenCalled();

    page.isPartOfArrangementRadio[0].click();
    page.isPartOfFranchiseRadio[1].click();
    page.isTrustRadio[0].click();
    page.hasCeasedToBePartOfGroupRadio[1].click();

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'organisationStructure',
      currentStep: 'ruDetails',
      route,
      payload: {
        noc: {
          organisationStructure: mockOrganisationStructure,
        },
        nocSectionsCompleted: { organisationStructure: 'IN_PROGRESS' },
      },
    });
  });
});
