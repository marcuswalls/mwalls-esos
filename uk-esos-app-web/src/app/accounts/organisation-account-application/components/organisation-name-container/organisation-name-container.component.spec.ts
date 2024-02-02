import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { initialState, OrganisationAccountStore } from '../../+state';
import { mockCreateOrganisationAccountStateProvider } from '../../testing/mock-create-organisation-account.state.provider';
import { mockOrganisationAccountStore } from '../../testing/mock-organisation-account.store';
import { OrganisationNameContainerComponent } from './organisation-name-container.component';

describe('OrganisationNameContainerComponent', () => {
  let component: OrganisationNameContainerComponent;
  let fixture: ComponentFixture<OrganisationNameContainerComponent>;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockOrganisationAccountStore.setRegisteredName.mockClear();
    mockOrganisationAccountStore._state.next(initialState);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, OrganisationNameContainerComponent],
      providers: [
        { provide: OrganisationAccountStore, useValue: mockOrganisationAccountStore },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationNameContainerComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should navigate to ../address and update store on valid and dirty form', () => {
      const mockFormGroup = {
        valid: true,
        dirty: true,
        get: jest.fn().mockReturnValue({ value: 'Test Organisation' }),
      } as any;
      component.onSubmit(mockFormGroup);
      expect(mockOrganisationAccountStore.setRegisteredName).toHaveBeenCalledWith('Test Organisation');
      expect(navigateSpy).toHaveBeenCalledWith(['../address'], expect.anything());
    });

    it('should navigate to ../address but not update store on valid and pristine form', () => {
      const mockFormGroup = {
        valid: true,
        dirty: false,
      } as any;
      component.onSubmit(mockFormGroup);
      expect(mockOrganisationAccountStore.setRegisteredName).not.toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['../address'], expect.anything());
    });
  });
});
