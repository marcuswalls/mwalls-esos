import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockOrganisationStructure, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { BasePage, MockType } from '@testing';

import { OrganisationStructureAddEditComponent } from './add-edit.component';

describe('AddEditComponent', () => {
  let component: OrganisationStructureAddEditComponent;
  let fixture: ComponentFixture<OrganisationStructureAddEditComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRoute();
  route.snapshot = new ActivatedRouteSnapshot();
  route.snapshot.params = { taskId: 1 };

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

  const createComponent = () => {
    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { organisationStructure: mockOrganisationStructure },
        { organisationStructure: 'IN_PROGRESS' as any },
      ),
    );

    fixture = TestBed.createComponent(OrganisationStructureAddEditComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  class Page extends BasePage<OrganisationStructureAddEditComponent> {
    get registrationNumber() {
      return this.getInputValue('#registrationNumber');
    }

    set registrationNumber(value: string) {
      this.setInputValue('#registrationNumber', value);
    }

    get organisationName() {
      return this.getInputValue('#organisationName');
    }

    set organisationName(value: string) {
      this.setInputValue('#organisationName', value);
    }

    get taxReferenceNumber() {
      return this.getInputValue('#taxReferenceNumber');
    }

    set taxReferenceNumber(value: string) {
      this.setInputValue('#taxReferenceNumber', value);
    }

    get isCoveredByThisNotification() {
      return this.queryAll<HTMLInputElement>('input[name$="isCoveredByThisNotification"]');
    }

    get isParentOfResponsibleUndertaking() {
      return this.queryAll<HTMLInputElement>('input[name$="isParentOfResponsibleUndertaking"]');
    }

    get isSubsidiaryOfResponsibleUndertaking() {
      return this.queryAll<HTMLInputElement>('input[name$="isSubsidiaryOfResponsibleUndertaking"]');
    }

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

    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and navigate to next route on add', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');
    const organisation = mockOrganisationStructure.organisationsAssociatedWithRU[0];

    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errors.map((error) => error.textContent.trim())).toEqual([
      'Enter the organisation name',
      'Select yes if this organisation is covered in the notification',
      'Select yes if 2 or more parent groups are complying as one participant',
      'Select yes if the organisation is a parent of the responsible undertaking',
      'Select yes if the organisation is a subsidiary of the responsible undertaking',
      'Select yes if the organisation is part of a franchise group',
      'Select yes if this organisation is a trust',
      'Select yes if this organisation was not part of the corporate group during the compliance period',
    ]);
    expect(taskServiceSpy).not.toHaveBeenCalled();

    page.registrationNumber = organisation.registrationNumber;
    page.organisationName = organisation.organisationName;
    page.taxReferenceNumber = organisation.taxReferenceNumber;
    page.isCoveredByThisNotification[0].click();
    page.isPartOfArrangementRadio[1].click();
    page.isParentOfResponsibleUndertaking[0].click();
    page.isSubsidiaryOfResponsibleUndertaking[1].click();
    page.isPartOfFranchiseRadio[1].click();
    page.isTrustRadio[0].click();
    page.hasCeasedToBePartOfGroupRadio[1].click();

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'organisationStructure',
      currentStep: 'add',
      route,
      payload: {
        noc: {
          organisationStructure: {
            ...mockOrganisationStructure,
            organisationsAssociatedWithRU: [
              organisation,
              {
                registrationNumber: organisation.registrationNumber,
                organisationName: organisation.organisationName,
                taxReferenceNumber: organisation.taxReferenceNumber,
                isCoveredByThisNotification: true,
                isPartOfArrangement: false,
                isParentOfResponsibleUndertaking: true,
                isSubsidiaryOfResponsibleUndertaking: false,
                isPartOfFranchise: false,
                isTrust: true,
                hasCeasedToBePartOfGroup: false,
              },
            ],
          },
        },
        nocSectionsCompleted: { organisationStructure: 'IN_PROGRESS' },
      },
    });
  });

  it('should submit and navigate to next route on edit', () => {
    route.snapshot.params = { taskId: 1, index: 1 };
    store.setState(
      mockStateBuild(
        { organisationStructure: mockOrganisationStructure },
        { organisationStructure: 'IN_PROGRESS' as any },
      ),
    );
    createComponent();

    const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');
    const organisation = mockOrganisationStructure.organisationsAssociatedWithRU[0];

    page.registrationNumber = 'New reg no';
    page.organisationName = 'New organisation name';
    page.taxReferenceNumber = 'New tax no';
    page.isCoveredByThisNotification[1].click();

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'organisationStructure',
      currentStep: 'edit',
      route,
      payload: {
        noc: {
          organisationStructure: {
            ...mockOrganisationStructure,
            organisationsAssociatedWithRU: [
              {
                ...organisation,
                registrationNumber: 'New reg no',
                organisationName: 'New organisation name',
                taxReferenceNumber: 'New tax no',
                isCoveredByThisNotification: false,
              },
            ],
          },
        },
        nocSectionsCompleted: { organisationStructure: 'IN_PROGRESS' },
      },
    });
  });
});
