import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { initialState, OrganisationAccountStore } from '../../+state';
import { mockCreateOrganisationAccountStateProvider } from '../../testing/mock-create-organisation-account.state.provider';
import { mockOrganisationAccountStore } from '../../testing/mock-organisation-account.store';
import { OrganisationLocationContainerComponent } from './organisation-location-container.component';

describe('OrganisationLocationContainerComponent', () => {
  let component: OrganisationLocationContainerComponent;
  let fixture: ComponentFixture<OrganisationLocationContainerComponent>;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockOrganisationAccountStore.setLocation.mockClear();
    mockOrganisationAccountStore._state.next(initialState);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, OrganisationLocationContainerComponent],
      providers: [
        { provide: OrganisationAccountStore, useValue: mockOrganisationAccountStore },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationLocationContainerComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should navigate to ../summary and update store on valid and dirty form', () => {
      const mockFormGroup = {
        valid: true,
        dirty: true,
        get: jest.fn().mockReturnValue({ value: 'Test Location' }),
      } as any;
      component.onSubmit(mockFormGroup);
      expect(mockOrganisationAccountStore.setLocation).toHaveBeenCalledWith('Test Location');
      expect(navigateSpy).toHaveBeenCalledWith(['../summary'], expect.anything());
    });

    it('should navigate to ../summary but not update store on valid and pristine form', () => {
      const mockFormGroup = {
        valid: true,
        dirty: false,
      } as any;
      component.onSubmit(mockFormGroup);
      expect(mockOrganisationAccountStore.setLocation).not.toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['../summary'], expect.anything());
    });
  });
});
