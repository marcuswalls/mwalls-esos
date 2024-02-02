import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { WorkflowsComponent } from '@accounts/index';
import { StatusTagColorPipe } from '@common/request-task/pipes/status-tag-color';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, mockClass } from '@testing';

import { RequestDetailsSearchResults, RequestsService } from 'esos-api';

import { mockedAccountPermit, mockWorkflowResults } from '../testing/mock-data';

describe('WorkflowsComponent', () => {
  let component: WorkflowsComponent;
  let fixture: ComponentFixture<WorkflowsComponent>;

  const requestsService = mockClass(RequestsService);

  const activatedRouteStub = new ActivatedRouteStub(undefined, undefined, {
    accountPermit: mockedAccountPermit,
  });

  const createComponent = async () => {
    fixture = TestBed.createComponent(WorkflowsComponent);
    component = fixture.componentInstance;
    component.currentTab = 'workflows';
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowsComponent],
      imports: [GovukDatePipe, RouterTestingModule, SharedModule, StatusTagColorPipe],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: RequestsService, useValue: requestsService },
      ],
    }).compileComponents();
  });

  describe('search filtering by type', () => {
    beforeEach(async () => {
      requestsService.getRequestDetailsByAccountId.mockReturnValue(
        of({ requestDetails: [mockWorkflowResults.requestDetails[0]], total: 1 } as RequestDetailsSearchResults),
      );
    });

    beforeEach(createComponent);

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('search filtering by status', () => {
    beforeEach(async () => {
      requestsService.getRequestDetailsByAccountId.mockReturnValue(
        of({ requestDetails: [mockWorkflowResults.requestDetails[0]], total: 1 } as RequestDetailsSearchResults),
      );
    });

    beforeEach(createComponent);

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
