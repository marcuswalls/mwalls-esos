import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { mockedOrganisationAccount } from '@accounts/testing/mock-data';
import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store/auth';
import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';
import { ActivatedRouteStub, BasePage, mockClass, MockType } from '@testing';

import {
  ItemDTOResponse,
  RequestActionDTO,
  RequestCreateActionProcessResponseDTO,
  RequestCreateValidationResult,
  RequestItemsService,
  RequestsService,
  UserStateDTO,
} from 'esos-api';

import { ProcessActionsComponent } from './process-actions.component';

describe('ProcessActionsComponent', () => {
  let component: ProcessActionsComponent;
  let fixture: ComponentFixture<ProcessActionsComponent>;
  let authStore: AuthStore;
  let router: Router;
  let page: Page;

  const activatedRouteStub = new ActivatedRouteStub(undefined, undefined, {
    account: mockedOrganisationAccount,
  });
  const taskId = 1;
  const processRequestCreateActionResponse: RequestCreateActionProcessResponseDTO = { requestId: '1234' };
  const requestService = mockClass(RequestsService);
  const requestItemsService = mockClass(RequestItemsService);

  const authService: MockType<AuthService> = {
    loadUserState: jest.fn(),
  };

  const createRequestPayload = (requestType) => ({
    requestCreateActionType: requestType,
    requestCreateActionPayload: {
      payloadType: 'EMPTY_PAYLOAD',
    },
  });

  const createComponent = () => {
    fixture = TestBed.createComponent(ProcessActionsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  const createModule = async (
    roleType: UserStateDTO['roleType'],
    mockedWorkflows?: Partial<Record<RequestActionDTO['requestType'], RequestCreateValidationResult>>,
  ) => {
    requestService.processRequestCreateAction.mockReturnValue(of(processRequestCreateActionResponse));
    requestService.getAvailableAccountWorkflows.mockReturnValue(of(mockedWorkflows ?? {}));
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: RequestsService, useValue: requestService },
        { provide: RequestItemsService, useValue: requestItemsService },
        { provide: AuthService, useValue: authService },
        ItemLinkPipe,
      ],
    }).compileComponents();
    authStore = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
    authStore.setUserState({
      ...authStore.getState().userState,
      roleType,
      userId: 'opTestId',
      status: 'ENABLED',
    });
    createComponent();
  };

  class Page extends BasePage<ProcessActionsComponent> {
    get buttons() {
      return this.queryAll<HTMLButtonElement>('button');
    }

    get buttonContents(): string[] {
      return this.buttons.map((item) => item.textContent.trim());
    }

    get noAvailableTaskContents(): string[] {
      return this.queryAll<HTMLLIElement>('.govuk-list > li').map((item) => item.textContent.trim());
    }

    get errorListContents(): string[] {
      return this.queryAll<HTMLLIElement>('.govuk-grid-column-full > .govuk-list > li').map((item) =>
        item.textContent.trim(),
      );
    }
  }

  describe('for operator', () => {
    it('should create', async () => {
      await createModule('OPERATOR');
      expect(component).toBeTruthy();
    });

    it('should retrieve available workflows and display them as expected', async () => {
      await createModule('OPERATOR', {
        NOTIFICATION_OF_COMPLIANCE_P3: { valid: true },
      });

      expect(page.buttonContents).toEqual(['Start']);
      expect(page.errorListContents).toEqual([]);
    });

    it('should retrieve available workflows and display error when another process is in progress', async () => {
      await createModule('OPERATOR', {
        NOTIFICATION_OF_COMPLIANCE_P3: { valid: false, requests: ['ORGANISATION_ACCOUNT_OPENING'] },
      });

      expect(page.buttonContents).toEqual([]);
      expect(page.errorListContents).toEqual([
        'You cannot start the Notification of Compliance process while the Account Creation is in progress.',
      ]);
    });

    it('should retrieve available workflows and display message when no tasks are available', async () => {
      await createModule('OPERATOR');

      expect(page.buttonContents).toEqual([]);
      expect(page.noAvailableTaskContents).toEqual(['There are no available processes to initiate.']);
    });

    it('should retrieve available workflows and display message account is not ENABLED', async () => {
      await createModule('OPERATOR', {
        NOTIFICATION_OF_COMPLIANCE_P3: {
          accountStatus: 'NEW',
        } as RequestCreateValidationResult,
      });

      const lastListElement = page.noAvailableTaskContents.length - 1;
      expect(page.buttonContents).toEqual([]);
      expect(page.noAvailableTaskContents[lastListElement]).toEqual(
        'You cannot start the Notification of Compliance while the account status is NEW.',
      );
    });

    it('should processRequestCreateAction, navigate to the task item page, when a single Task Item is received', async () => {
      const expectedRequestType = 'NOTIFICATION_OF_COMPLIANCE_P3';
      const getItemsResponse: ItemDTOResponse = { items: [{ requestType: expectedRequestType, taskId }] };
      requestItemsService.getItemsByRequest.mockReturnValueOnce(of(getItemsResponse));
      await createModule('OPERATOR', { NOTIFICATION_OF_COMPLIANCE_P3: { valid: true } });

      const onRequestButtonClickSpy = jest.spyOn(component, 'onRequestButtonClick');
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.buttons[0].click();

      expect(onRequestButtonClickSpy).toHaveBeenCalledTimes(1);
      expect(onRequestButtonClickSpy).toHaveBeenCalledWith(expectedRequestType);

      expect(requestService.processRequestCreateAction).toHaveBeenCalledTimes(1);
      expect(requestService.processRequestCreateAction).toHaveBeenCalledWith(
        createRequestPayload(expectedRequestType),
        0,
      );

      expect(requestItemsService.getItemsByRequest).toHaveBeenCalledTimes(1);
      expect(requestItemsService.getItemsByRequest).toHaveBeenCalledWith(processRequestCreateActionResponse.requestId);

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith(['/tasks', 1]);
    });

    it('should processRequestCreateAction, navigate to dashboard, when multiple or 0 task Items are received', async () => {
      requestItemsService.getItemsByRequest.mockReturnValueOnce(of({ items: [] }));
      await createModule('OPERATOR', { NOTIFICATION_OF_COMPLIANCE_P3: { valid: true } });

      const navigateSpy = jest.spyOn(router, 'navigate');
      page.buttons[0].click();
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenLastCalledWith(['/dashboard']);

      requestItemsService.getItemsByRequest.mockReturnValueOnce(
        of({
          items: [
            { requestType: 'NOTIFICATION_OF_COMPLIANCE_P3', taskId: taskId },
            { requestType: 'NOTIFICATION_OF_COMPLIANCE_P3', taskId: taskId + 1 },
          ],
        }),
      );
      page.buttons[0].click();
      expect(navigateSpy).toHaveBeenCalledTimes(2);
      expect(navigateSpy).toHaveBeenLastCalledWith(['/dashboard']);
    });
  });
});
