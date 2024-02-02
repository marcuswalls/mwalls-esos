import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import { mockEnergySavingsAchieved, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage } from '@testing';

import EnergySavingsAchievedCategoriesExistComponent from './energy-savings-achieved-categories-exist.component';

describe('EnergySavingsAchievedCategoriesExistComponent', () => {
  let component: EnergySavingsAchievedCategoriesExistComponent;
  let fixture: ComponentFixture<EnergySavingsAchievedCategoriesExistComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsAchievedCategoriesExistComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get energySavingCategoriesExist() {
      return this.query('div[govuk-radio]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergySavingsAchievedCategoriesExistComponent],
      providers: [
        provideNotificationTaskServices(),
        provideNotificationSideEffects(),
        provideNotificationStepFlowManagers(),
        RequestTaskStore,
        SideEffectsHandler,
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { energySavingsAchieved: mockEnergySavingsAchieved },
        { energySavingsAchieved: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(EnergySavingsAchievedCategoriesExistComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading the form field', () => {
    expect(page.heading1.textContent.trim()).toEqual(
      'Do you have any information on the energy savings achieved during the compliance period against different energy saving categories?',
    );

    expect(page.energySavingCategoriesExist).toBeTruthy();
  });
});
