import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { initialState, OrganisationAccountStore } from '../../+state';
import { mockCreateOrganisationAccountStateProvider } from '../../testing/mock-create-organisation-account.state.provider';
import { mockOrganisationAccountStore } from '../../testing/mock-organisation-account.store';
import { OrganisationAddressContainerComponent } from './organisation-address.container.component';

describe('OrganisationAddressContainerComponent', () => {
  let component: OrganisationAddressContainerComponent;
  let fixture: ComponentFixture<OrganisationAddressContainerComponent>;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockOrganisationAccountStore.setAddress.mockClear();
    mockOrganisationAccountStore._state.next(initialState);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, OrganisationAddressContainerComponent],
      providers: [
        { provide: OrganisationAccountStore, useValue: mockOrganisationAccountStore },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationAddressContainerComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should navigate to ../location and update store on valid and dirty form', () => {
      const mockAddressDetails = {
        /* mock address details */
      };
      const mockFormGroup = {
        valid: true,
        dirty: true,
        value: { addressDetails: mockAddressDetails },
      } as any;
      component.onSubmit(mockFormGroup);
      expect(mockOrganisationAccountStore.setAddress).toHaveBeenCalledWith(mockAddressDetails);
      expect(navigateSpy).toHaveBeenCalledWith(['../location'], expect.anything());
    });

    it('should navigate to ../location but not update store on valid and pristine form', () => {
      const mockFormGroup = {
        valid: true,
        dirty: false,
      } as any;
      component.onSubmit(mockFormGroup);
      expect(mockOrganisationAccountStore.setAddress).not.toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['../location'], expect.anything());
    });
  });
});
