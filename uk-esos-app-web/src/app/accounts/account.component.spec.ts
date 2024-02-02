import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { OperatorsComponent, WorkflowsComponent } from '@accounts/index';
import { AuthService } from '@core/services/auth.service';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { AuthStore } from '@core/store/auth';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, BasePage } from '@testing';

import { SharedUserModule } from '../shared-user/shared-user.module';
import { AccountComponent } from './account.component';
import { DetailsComponent } from './details/details.component';
import { mockedOrganisationAccount } from './testing/mock-data';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let authStore: AuthStore;
  let page: Page;
  let authService: Partial<jest.Mocked<AuthService>>;

  const activatedRouteStub = new ActivatedRouteStub(undefined, undefined, {
    data: mockedOrganisationAccount,
  });

  class Page extends BasePage<AccountComponent> {
    get heading() {
      return this.query<HTMLElement>('esos-page-heading h1.govuk-heading-xl');
    }

    get status() {
      return this.heading.querySelector<HTMLSpanElement>('span.status');
    }

    get tabs() {
      return Array.from(this.queryAll<HTMLLIElement>('ul.govuk-tabs__list > li'));
    }
  }

  beforeEach(async () => {
    authService = {
      loadUserState: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [AccountComponent, WorkflowsComponent, OperatorsComponent],
      imports: [
        RouterTestingModule,
        SharedModule,
        SharedUserModule,
        GovukDatePipe,
        PageHeadingComponent,
        DetailsComponent,
      ],
      providers: [
        DestroySubject,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      ...authStore.getState().userState,
      status: 'ENABLED',
      roleType: 'OPERATOR',
      userId: 'opTestId',
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    window.history.pushState({ accountTypes: 'ORGANISATION', page: '1' }, 'yes');
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the account name', () => {
    expect(page.heading.textContent.trim()).toContain(mockedOrganisationAccount.name);
  });

  it('should render the status', () => {
    expect(page.status.textContent.trim()).toEqual('Live');
  });

  describe('for operators', () => {
    beforeEach(() => {
      authStore.setUserState({
        ...authStore.getState().userState,
        roleType: 'OPERATOR',
        userId: 'opTestId',
      });
      fixture.detectChanges();
    });

    it('should render all tabs', () => {
      expect(page.tabs.map((tab) => tab.textContent.trim())).toEqual([
        'Details',
        'Phases',
        'Users and contacts',
        'Workflow history',
      ]);
    });
  });

  describe('for regulators', () => {
    beforeEach(() => {
      authStore.setUserState({
        ...authStore.getState().userState,
        roleType: 'REGULATOR',
        userId: 'opTestId',
      });
      fixture.detectChanges();
    });

    it('should render all tabs', () => {
      expect(page.tabs.map((tab) => tab.textContent.trim())).toEqual([
        'Details',
        'Phases',
        'Users and contacts',
        'Workflow history',
        'Notes',
      ]);
    });
  });
});
