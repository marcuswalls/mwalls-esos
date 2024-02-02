import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import { EnergyIntensityRatioComponent } from '@tasks/notification/subtasks/energy-consumption/energy-intensity-ratio/energy-intensity-ratio.component';
import {
  mockEnergyConsumptionDetails,
  mockNotificationRequestTask,
  mockStateBuild,
} from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskActionPayload, TasksService } from 'esos-api';

describe('EnergyIntensityRatioComponent', () => {
  let component: EnergyIntensityRatioComponent;
  let fixture: ComponentFixture<EnergyIntensityRatioComponent>;
  let store: RequestTaskStore;
  let router: Router;
  let page: Page;

  const route = new ActivatedRouteStub();

  const tasksService: MockType<TasksService> = {
    processRequestTaskAction: jest.fn().mockReturnValue(of(null)),
  };

  class Page extends BasePage<EnergyIntensityRatioComponent> {
    get ratios() {
      return this.queryAll<HTMLInputElement>('input[name$="ratio"]');
    }
    get units() {
      return this.queryAll<HTMLInputElement>('input[name$="unit"]');
    }
    get additionalInformation() {
      return this.queryAll<HTMLTextAreaElement>('textarea[id$="additionalInformation"]');
    }
    get names() {
      return this.queryAll<HTMLInputElement>('input[name$="name"]');
    }

    set ratio(value: number) {
      this.setInputValue('#buildingsIntensityRatio.ratio', value);
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
        provideNotificationTaskServices(),
        provideNotificationSideEffects(),
        provideNotificationStepFlowManagers(),
        SideEffectsHandler,
        RequestTaskStore,
        HttpClient,
        HttpHandler,
        { provide: ActivatedRoute, useValue: route },
        { provide: TasksService, useValue: tasksService },
      ],
    });
  });

  describe('when edit energy intensity ratio', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          { energyConsumptionDetails: mockEnergyConsumptionDetails },
          { energyConsumptionDetails: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(EnergyIntensityRatioComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show input values', () => {
      expect(page.ratios.length).toEqual(5);
      expect(page.ratios[0].value).toEqual('50');
      expect(page.ratios[1].value).toEqual('60');
      expect(page.ratios[2].value).toEqual('70');
      expect(page.ratios[3].value).toEqual('80');
      expect(page.ratios[4].value).toEqual('100');

      expect(page.units.length).toEqual(5);
      expect(page.units[0].value).toEqual('m2');
      expect(page.units[1].value).toEqual('freight miles');
      expect(page.units[2].value).toEqual('passenger miles');
      expect(page.units[3].value).toEqual('tonnes');
      expect(page.units[4].value).toEqual('litres');

      expect(page.additionalInformation.length).toEqual(4);
      expect(page.additionalInformation[0].value).toEqual('Buildings additional information');
      expect(page.additionalInformation[1].value).toEqual('');
      expect(page.additionalInformation[2].value).toEqual('');
      expect(page.additionalInformation[3].value).toEqual('');

      expect(page.names.length).toEqual(1);
      expect(page.names[0].value).toEqual('custom');
    });

    it('should submit and navigate to additional info page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      page.ratio = 500;
      fixture.detectChanges();

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(tasksService.processRequestTaskAction).toHaveBeenCalledWith({
        requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
        requestTaskId: 2,
        requestTaskActionPayload: {
          payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
          noc: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.noc,
            energyConsumptionDetails: {
              ...mockEnergyConsumptionDetails,
              energyIntensityRatioData: {
                ...mockEnergyConsumptionDetails.energyIntensityRatioData,
                buildingsIntensityRatio: {
                  ratio: 500,
                  unit: 'm2',
                  additionalInformation: 'Buildings additional information',
                },
              },
            },
          },
          nocSectionsCompleted: {
            ...mockNotificationRequestTask.requestTaskItem.requestTask.payload.nocSectionsCompleted,
            energyConsumptionDetails: TaskItemStatus.IN_PROGRESS,
          },
        } as RequestTaskActionPayload,
      });

      expect(navigateSpy).toHaveBeenCalledWith(['../additional-info'], { relativeTo: route });
    });
  });

  describe('for new energy intensity ratio', () => {
    beforeEach(() => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          {
            energyConsumptionDetails: {
              totalEnergyConsumption: mockEnergyConsumptionDetails.totalEnergyConsumption,
              significantEnergyConsumptionExists: true,
              significantEnergyConsumption: mockEnergyConsumptionDetails.significantEnergyConsumption,
            },
          },
          { energyConsumptionDetails: null },
        ),
      );

      fixture = TestBed.createComponent(EnergyIntensityRatioComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show default input values', () => {
      expect(page.units[0].value).toEqual('m2');
      expect(page.units[1].value).toEqual('tonne mile');
      expect(page.units[2].value).toEqual('person mile');
    });
  });
});
