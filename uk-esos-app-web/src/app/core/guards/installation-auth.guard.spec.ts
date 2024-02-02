import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom } from 'rxjs';

import {
  mockAuthorityService,
  mockKeycloakService,
  mockTermsAndConditionsService,
  mockUsersService,
} from '@core/guards/mocks';
import { AuthStore } from '@core/store/auth';
import { ActivatedRouteStub } from '@testing';
import { KeycloakService } from 'keycloak-angular';

import { AuthoritiesService, TermsAndConditionsService, UsersService } from 'esos-api';

import { InstallationAuthGuard } from './installation-auth.guard';

describe('InstallationAuthGuard', () => {
  let guard: InstallationAuthGuard;
  let authStore: AuthStore;
  let router: Router;
  const route = new ActivatedRouteStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: KeycloakService, useValue: mockKeycloakService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthoritiesService, useValue: mockAuthorityService },
        { provide: TermsAndConditionsService, useValue: mockTermsAndConditionsService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({ status: 'ENABLED' });
    guard = TestBed.inject(InstallationAuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow navigation when loginStatus enabled', async () => {
    const result = await lastValueFrom(guard.canActivate());
    expect(result).toEqual(true);
  });

  it('should redirect to landing page when loginStatus not enabled', async () => {
    authStore.setUserState({ status: 'DISABLED' });
    const result = await lastValueFrom(guard.canActivate());
    expect(result).toEqual(router.parseUrl('landing'));
  });

  it(`should allow when role is REGULATOR or VERIFIER and has no permissions`, async () => {
    authStore.setUserState({
      status: 'NO_AUTHORITY',
      roleType: 'REGULATOR',
    });
    const result = await lastValueFrom(guard.canActivate());
    expect(result).toEqual(true);
  });
});
