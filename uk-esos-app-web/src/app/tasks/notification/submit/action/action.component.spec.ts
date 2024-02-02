import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { NotificationSubmitActionComponent } from './action.component';

describe('ActionComponent', () => {
  let component: NotificationSubmitActionComponent;
  let fixture: ComponentFixture<NotificationSubmitActionComponent>;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    submit: jest.fn().mockImplementation(),
  };

  class Page extends BasePage<NotificationSubmitActionComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });
    fixture = TestBed.createComponent(NotificationSubmitActionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and navigate to confirmation page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submit');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'submit',
      currentStep: 'action',
      route: activatedRoute,
    });
  });
});
