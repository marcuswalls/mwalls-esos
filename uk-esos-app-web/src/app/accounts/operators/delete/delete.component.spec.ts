import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { DeleteComponent } from '@accounts/index';
import { AuthService } from '@core/services/auth.service';
import { AuthStore } from '@core/store/auth';
import { BusinessTestingModule, expectBusinessErrorToBe } from '@error/testing/business-error';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, BasePage, mockClass, MockType } from '@testing';

import { OperatorAuthoritiesService } from 'esos-api';

import { operator } from '../../testing/mock-data';
import { saveNotFoundOperatorError } from '../errors/business-error';

describe('DeleteComponent', () => {
  let component: DeleteComponent;
  let fixture: ComponentFixture<DeleteComponent>;
  let page: Page;
  let authStore: AuthStore;

  class Page extends BasePage<DeleteComponent> {
    get confirmButton() {
      return this.query<HTMLButtonElement>('button');
    }

    get link() {
      return this.query<HTMLAnchorElement>('a');
    }
  }

  const authService: MockType<AuthService> = {
    loadUserState: jest.fn(),
  };
  const operatorAuthoritiesService = mockClass(OperatorAuthoritiesService);
  const route = new ActivatedRouteStub({ accountId: '123', userId: 'test1' }, undefined, {
    user: { ...operator, userId: 'test1' },
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteComponent],
      imports: [RouterTestingModule, BusinessTestingModule, SharedModule, PageHeadingComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: OperatorAuthoritiesService, useValue: operatorAuthoritiesService },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({ userId: 'test1', status: 'ENABLED' });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should delete self and point to dashboard', () => {
    operatorAuthoritiesService.deleteCurrentUserAccountOperatorAuthority.mockReturnValueOnce(of(null));
    authService.loadUserState.mockReturnValueOnce(of(null));
    page.confirmButton.click();
    fixture.detectChanges();

    expect(page.link.textContent.trim()).toEqual('Go to my dashboard');
    expect(page.link.href).toMatch(/\/dashboard$/);
  });

  it('should delete self and point to welcome page', () => {
    operatorAuthoritiesService.deleteCurrentUserAccountOperatorAuthority.mockReturnValueOnce(of(null));
    authService.loadUserState.mockReturnValueOnce(of(null));
    authStore.setUserState({ userId: 'test1', status: 'NO_AUTHORITY' });
    page.confirmButton.click();
    fixture.detectChanges();

    expect(page.link.textContent.trim()).toEqual('Go to my dashboard');
    expect(page.link.href).not.toMatch(/\/dashboard$/);
  });

  it('should delete other user and point back to the list', () => {
    operatorAuthoritiesService.deleteCurrentUserAccountOperatorAuthority.mockReturnValueOnce(of(null));
    operatorAuthoritiesService.deleteAccountOperatorAuthority.mockReturnValueOnce(of(null));
    authService.loadUserState.mockReturnValueOnce(of(null));
    authStore.setUserState({ userId: 'test2', status: 'NO_AUTHORITY' });
    page.confirmButton.click();
    fixture.detectChanges();

    expect(page.link.textContent.trim()).toEqual(`Return to the users and contacts page`);
    expect(page.link.href).not.toMatch(/\/dashboard$/);
  });

  it('should navigate to save error when deleting an already deleted user', async () => {
    operatorAuthoritiesService.deleteCurrentUserAccountOperatorAuthority.mockReturnValueOnce(of(null));
    operatorAuthoritiesService.deleteAccountOperatorAuthority.mockReturnValueOnce(
      throwError(() => new HttpErrorResponse({ status: 400, error: { code: 'AUTHORITY1004' } })),
    );
    authService.loadUserState.mockReturnValueOnce(of(null));
    authStore.setUserState({ userId: 'test2', status: 'NO_AUTHORITY' });
    page.confirmButton.click();
    fixture.detectChanges();

    await expectBusinessErrorToBe(saveNotFoundOperatorError(123));
  });
});
