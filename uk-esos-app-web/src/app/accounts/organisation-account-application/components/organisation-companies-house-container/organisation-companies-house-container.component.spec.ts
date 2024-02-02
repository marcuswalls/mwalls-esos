import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { initialState, OrganisationAccountStore } from '../../+state';
import { mockCreateOrganisationAccountStateProvider } from '../../testing/mock-create-organisation-account.state.provider';
import { mockOrganisationAccountStore } from '../../testing/mock-organisation-account.store';
import { OrganisationCompaniesHouseContainerComponent } from './organisation-companies-house-container.component';

describe('OrganisationCompaniesHouseContainerComponent', () => {
  let component: OrganisationCompaniesHouseContainerComponent;
  let fixture: ComponentFixture<OrganisationCompaniesHouseContainerComponent>;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockOrganisationAccountStore.setRegistrationStatus.mockClear();
    mockOrganisationAccountStore.setRegistrationNumber.mockClear();
    mockOrganisationAccountStore._state.next(initialState);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, OrganisationCompaniesHouseContainerComponent],
      providers: [
        { provide: OrganisationAccountStore, useValue: mockOrganisationAccountStore },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationCompaniesHouseContainerComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should navigate to name and update store on valid and dirty form', () => {
      const mockFormGroup = {
        valid: true,
        dirty: true,
        get: jest.fn(
          (field) =>
            ({
              registrationStatus: { value: true },
              registrationNumber: { value: '123456' },
            }[field]),
        ),
      } as any;
      component.onSubmit(mockFormGroup);
      expect(mockOrganisationAccountStore.setRegistrationStatus).toHaveBeenCalledWith(true);
      expect(mockOrganisationAccountStore.setRegistrationNumber).toHaveBeenCalledWith('123456');
      expect(navigateSpy).toHaveBeenCalledWith(['name'], expect.anything());
    });

    it('should navigate to name but not update store on valid and pristine form', () => {
      const mockFormGroup = {
        valid: true,
        dirty: false,
      } as any;
      component.onSubmit(mockFormGroup);
      expect(mockOrganisationAccountStore.setRegistrationStatus).not.toHaveBeenCalled();
      expect(mockOrganisationAccountStore.setRegistrationNumber).not.toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['name'], expect.anything());
    });
  });
});
