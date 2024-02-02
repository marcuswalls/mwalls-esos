import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ResponsibleUndertakingSummaryPageComponent } from '@shared/components/summaries';
import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('ResponsibleUndertakingSummaryPageComponent', () => {
  let component: ResponsibleUndertakingSummaryPageComponent;
  let fixture: ComponentFixture<ResponsibleUndertakingSummaryPageComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<ResponsibleUndertakingSummaryPageComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });
    fixture = TestBed.createComponent(ResponsibleUndertakingSummaryPageComponent);
    component = fixture.componentInstance;
    component.isEditable = true;
    component.responsibleUndertaking = {
      organisationDetails: {
        name: 'Corporate Legal Entity Account 2',
        registrationNumber: '111111',
        line1: 'Some address 1',
        line2: 'Some address 2',
        city: 'London',
        county: 'London',
        postcode: '511111',
      },
      tradingDetails: {
        exist: true,
        tradingName: 'Trading name',
      },
      organisationContactDetails: {
        email: '1@o.com',
        phoneNumber: {
          countryCode: '44',
          number: '02071234567',
        },
      },
      hasOverseasParentDetails: true,
      overseasParentDetails: {
        name: 'Parent company name',
        tradingName: 'Parent company trading name',
      },
    };
    component.wizardStep = {};
    component.responsibleUndertakingMap = responsibleUndertakingMap;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaries).toEqual([
      'Organisation name',
      'Corporate Legal Entity Account 2',
      'Change',
      'Registration number',
      '111111',
      'Change',
      'Address line 1',
      'Some address 1',
      'Change',
      'Address line 2',
      'Some address 2',
      'Change',
      'Town or city',
      'London',
      'Change',
      'County',
      'London',
      'Change',
      'Postcode',
      '511111',
      'Change',
      'Yes  Trading name',
      '',
      'Change',
      'Email address',
      '1@o.com',
      'Change',
      'Telephone number',
      '44 02071234567',
      'Change',
      'Yes',
      '',
      'Change',
      'Parent company name',
      'Parent company name',
      'Change',
      'Parent company trading name',
      'Parent company trading name',
      'Change',
    ]);
  });
});
