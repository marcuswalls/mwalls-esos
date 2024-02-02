import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { mockCreateOrganisationAccountStateProvider } from '@accounts/organisation-account-application/testing/mock-create-organisation-account.state.provider';
import { mockOrganisationAccountStore } from '@accounts/organisation-account-application/testing/mock-organisation-account.store';
import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { OrganisationAccountStore } from '../../../accounts/organisation-account-application/+state';
import { OrganisationCompaniesHouseFormComponent } from './organisation-companies-house-form.component';

describe('OrganisationCompaniesHouseFormComponent', () => {
  let component: OrganisationCompaniesHouseFormComponent;
  let fixture: ComponentFixture<OrganisationCompaniesHouseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationCompaniesHouseFormComponent, RouterTestingModule],
      providers: [
        { provide: OrganisationAccountStore, useValue: mockOrganisationAccountStore },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationCompaniesHouseFormComponent);
    component = fixture.componentInstance;

    const fb = new UntypedFormBuilder();
    component.formGroup = fb.group({
      registrationStatus: new UntypedFormControl(''),
      registrationNumber: new UntypedFormControl(''),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should emit formGroup when form is valid or dirty', () => {
      const emitSpy = jest.spyOn(component.submitForm, 'emit');
      component.formGroup.setValidators(() => null);
      component.formGroup.markAsDirty();
      component.onSubmit();
      expect(emitSpy).toHaveBeenCalledWith(component.formGroup);
    });

    it('should not emit formGroup when form is invalid and pristine', async () => {
      const emitSpy = jest.spyOn(component.submitForm, 'emit');
      component.formGroup.setValidators(() => ({ invalid: true }));
      component.formGroup.get('registrationStatus').setValue(null);
      component.formGroup.get('registrationNumber').setValue(null);
      component.formGroup.updateValueAndValidity();
      component.formGroup.markAsPristine();

      await fixture.whenStable();

      component.onSubmit();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
