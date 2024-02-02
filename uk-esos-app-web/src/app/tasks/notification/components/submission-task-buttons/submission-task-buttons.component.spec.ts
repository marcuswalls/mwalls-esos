import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { mockStateBuild } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub } from '@testing';

import { SubmissionTaskButtonsComponent } from './submission-task-buttons.component';

describe('SubmissionTaskButtonsComponent', () => {
  let component: SubmissionTaskButtonsComponent;
  let fixture: ComponentFixture<SubmissionTaskButtonsComponent>;
  let store: RequestTaskStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestTaskStore, { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild());

    fixture = TestBed.createComponent(SubmissionTaskButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
