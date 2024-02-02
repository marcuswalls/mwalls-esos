import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { screen } from '@testing-library/angular';

import { AccountOpeningDecisionPayload } from 'esos-api';

import { OrganisationAccountDecisionDetailsComponent } from './organisation-account-decision-details.component';

@Component({
  selector: 'esos-mock-parent',
  template: `<esos-organisation-account-decision-details [details]="details" />`,
  standalone: true,
  imports: [OrganisationAccountDecisionDetailsComponent],
})
class MockParentComponent {
  details: AccountOpeningDecisionPayload = {
    decision: 'APPROVED',
    reason: 'TEST_REASON',
  };
}

describe('OrganisationAccountDecisionDetailsComponent', () => {
  let component: MockParentComponent;
  let fixture: ComponentFixture<MockParentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockParentComponent],
    });
    fixture = TestBed.createComponent(MockParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show approval details', () => {
    expect(screen.getByText('Approval details')).toBeVisible();
    expect(screen.getByText('TEST_REASON')).toBeVisible();
  });

  it('should show rejection details', () => {
    component.details = {
      ...component.details,
      decision: 'REJECTED',
    };
    fixture.detectChanges();

    expect(screen.getByText('Rejection details')).toBeVisible();
    expect(screen.getByText('TEST_REASON')).toBeVisible();
  });
});
