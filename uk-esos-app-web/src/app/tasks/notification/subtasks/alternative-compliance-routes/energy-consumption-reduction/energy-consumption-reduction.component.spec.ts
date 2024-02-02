import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { alternativeComplianceRoutesMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import {
  ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
  CurrentStep,
} from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes.helper';
import {
  mockAlternativeComplianceRoutes,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { EnergyConsumptionReductionComponent } from './energy-consumption-reduction.component';

describe('EnergyConsumptionReductionComponent', () => {
  let component: EnergyConsumptionReductionComponent;
  let fixture: ComponentFixture<EnergyConsumptionReductionComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          alternativeComplianceRoutes: mockAlternativeComplianceRoutes,
        } as any,
      };
    },
  };

  class Page extends BasePage<EnergyConsumptionReductionComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get buildings(): number {
      return +this.getInputValue('#buildings');
    }

    set buildings(value: number) {
      this.setInputValue('#buildings', value);
    }

    get transport(): number {
      return +this.getInputValue('#transport');
    }

    set transport(value: number) {
      this.setInputValue('#transport', value);
    }

    get industrialProcesses(): number {
      return +this.getInputValue('#industrialProcesses');
    }

    set industrialProcesses(value: number) {
      this.setInputValue('#industrialProcesses', value);
    }

    get otherProcesses(): number {
      return +this.getInputValue('#otherProcesses');
    }

    set otherProcesses(value: number) {
      this.setInputValue('#otherProcesses', value);
    }

    get total() {
      return this.query<HTMLParagraphElement>('p.govuk-body').textContent.trim();
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(EnergyConsumptionReductionComponent);
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
      ],
    });
  });

  describe('for new energy consumption reduction details', () => {
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.energyConsumptionReduction.title);
      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid form and navigate to nextRoute', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.buildings = 1;
      page.transport = 2;
      page.industrialProcesses = 3;
      page.otherProcesses = 4;

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: {
              ...mockAlternativeComplianceRoutes,
              energyConsumptionReduction: {
                buildings: 1,
                transport: 2,
                industrialProcesses: 3,
                otherProcesses: 4,
                total: 10,
              },
            },
          },
        },
      });
    });
  });

  describe('for existing energy consumption reduction details', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { alternativeComplianceRoutes: mockAlternativeComplianceRoutes },
          { alternativeComplianceRoutes: TaskItemStatus.IN_PROGRESS },
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
      expect(page.heading1.textContent.trim()).toEqual(alternativeComplianceRoutesMap.energyConsumptionReduction.title);
      expect(page.buildings).toEqual(1);
      expect(page.transport).toEqual(5);
      expect(page.industrialProcesses).toEqual(4);
      expect(page.otherProcesses).toEqual(2);
      expect(page.total).toEqual('12 kWh');
      expect(page.submitButton).toBeTruthy();
    });

    it(`should submit a valid form and navigate to nextRoute`, () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ALTERNATIVE_COMPLIANCE_ROUTES_SUB_TASK,
        currentStep: CurrentStep.ENERGY_CONSUMPTION_REDUCTION,
        route: route,
        payload: {
          noc: {
            alternativeComplianceRoutes: mockAlternativeComplianceRoutes,
          },
        },
      });
    });
  });
});
