import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { screen } from '@testing-library/angular';

import { OrganisationAccountOpeningDecisionSubmittedRequestActionPayload } from 'esos-api';

import { OrganisationAccountDecisionComponent } from './organisation-account-decision.component';

describe('OrganisationAccountApprovedComponent', () => {
  let component: OrganisationAccountDecisionComponent;
  let fixture: ComponentFixture<OrganisationAccountDecisionComponent>;
  let store: RequestActionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, OrganisationAccountDecisionComponent],
    });

    store = TestBed.inject(RequestActionStore);
    store.setAction({
      type: 'INSTALLATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED',
      payload: {
        payloadType: 'ORGANISATION_ACCOUNT_OPENING_DECISION_SUBMITTED_PAYLOAD',
        decision: {
          decision: 'APPROVED',
          reason: 'TEST_REASON',
        },
        account: {
          registrationNumber: 'TEST_REG_NUM',
          name: 'TEST_NAME',
          competentAuthority: 'ENGLAND',
          line1: 'TEST_ADDRESS',
          city: 'TEST_CITY',
          county: 'TEST_COUNTY',
          postcode: 'TEST_PC',
        },
        participantDetails: {
          firstName: 'TEST_FNAME',
          lastName: 'TEST_LNAME',
          jobTitle: 'TEST_JOB_TITLE',
          phoneNumber: {
            countryCode: 'TEST_COUNTRY_CODE',
            number: 'TEST_PHONE_NUMBER',
          },
          mobileNumber: {},
          line1: 'TEST_ADDRESS',
          city: 'TEST_CITY',
          county: 'TEST_COUNTY',
          postcode: 'TEST_PC',
        },
      } as OrganisationAccountOpeningDecisionSubmittedRequestActionPayload,
    });

    fixture = TestBed.createComponent(OrganisationAccountDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show decision details', () => {
    expect(screen.getByText('Approval details')).toBeVisible();
    expect(screen.getByText('TEST_REASON')).toBeVisible();
  });

  it('should show account details', () => {
    expect(screen.getByText('TEST_REG_NUM')).toBeVisible();
    expect(screen.getByText('TEST_NAME')).toBeVisible();
    expect(screen.getByText('England')).toBeVisible();
  });

  it('should show user details', () => {
    expect(screen.getByText('TEST_FNAME')).toBeVisible();
    expect(screen.getByText('TEST_LNAME')).toBeVisible();
    expect(screen.getByText('TEST_JOB_TITLE')).toBeVisible();
  });
});
