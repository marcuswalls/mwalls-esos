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

import EnergySavingsAchievedDetailsComponent from './energy-savings-achieved-details.component';

describe('EnergySavingsAchievedDetailsComponent', () => {
  let component: EnergySavingsAchievedDetailsComponent;
  let fixture: ComponentFixture<EnergySavingsAchievedDetailsComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsAchievedDetailsComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get details() {
      return this.getInputValue('#details');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergySavingsAchievedDetailsComponent],
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

    fixture = TestBed.createComponent(EnergySavingsAchievedDetailsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading and the form field', () => {
    expect(page.heading1.textContent.trim()).toEqual(
      'Enter details of any government support received in order to implement energy saving measures during the compliance period (optional)',
    );

    expect(page.details).toBe('lorem ipsum');
  });
});
