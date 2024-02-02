import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { mockOrganisationStructure, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { BasePage, MockType } from '@testing';

import { OrganisationStructureListComponent } from './list.component';

describe('ListComponent', () => {
  let component: OrganisationStructureListComponent;
  let fixture: ComponentFixture<OrganisationStructureListComponent>;
  let store: RequestTaskStore;
  let router: Router;
  let page: Page;

  const route = new ActivatedRoute();
  route.snapshot = new ActivatedRouteSnapshot();
  route.snapshot.queryParams = { page: 1 };

  const taskService: MockType<NotificationService> = {
    saveSubtask: jest.fn().mockImplementation(),
    get payload(): NotificationTaskPayload {
      return {
        noc: {
          organisationStructure: mockOrganisationStructure,
        } as any,
        nocSectionsCompleted: { organisationStructure: TaskItemStatus.IN_PROGRESS },
      };
    },
  };

  class Page extends BasePage<OrganisationStructureListComponent> {
    get buttons() {
      return this.queryAll<HTMLButtonElement>('a[type="button"]');
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
        { organisationStructure: mockOrganisationStructure },
        { organisationStructure: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(OrganisationStructureListComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to add page', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');
    page.buttons[0].click();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to summary page', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl');
    page.buttons[1].click();

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });
});
