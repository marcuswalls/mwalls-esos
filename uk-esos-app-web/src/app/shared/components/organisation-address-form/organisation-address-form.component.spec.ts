import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { mockCreateOrganisationAccountStateProvider } from '@accounts/organisation-account-application/testing/mock-create-organisation-account.state.provider';
import { mockOrganisationAccountStore } from '@accounts/organisation-account-application/testing/mock-organisation-account.store';
import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { OrganisationAccountStore } from '../../../accounts/organisation-account-application/+state';
import { OrganisationAddressFormComponent } from './organisation-address-form.component';

describe('OrganisationAddressFormComponent', () => {
  let component: OrganisationAddressFormComponent;
  let fixture: ComponentFixture<OrganisationAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationAddressFormComponent],
      providers: [
        { provide: OrganisationAccountStore, useValue: mockOrganisationAccountStore },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationAddressFormComponent);
    component = fixture.componentInstance;

    const fb = new UntypedFormBuilder();
    component.formGroup = fb.group({
      addressDetails: fb.group({
        line1: new UntypedFormControl(''),
        line2: new UntypedFormControl(''),
        city: new UntypedFormControl(''),
        county: new UntypedFormControl(''),
        postcode: new UntypedFormControl(''),
      }),
    });

    fixture.detectChanges();
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

      // Set nested form controls to invalid state
      const addressDetailsGroup = component.formGroup.get('addressDetails') as UntypedFormGroup;
      addressDetailsGroup.get('line1').setValue(null);
      addressDetailsGroup.get('line2').setValue(null);
      addressDetailsGroup.get('city').setValue(null);
      addressDetailsGroup.get('county').setValue(null);
      addressDetailsGroup.get('postcode').setValue(null);

      component.formGroup.updateValueAndValidity();
      component.formGroup.markAsPristine();

      fixture.detectChanges();
      await fixture.whenStable();

      component.onSubmit();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
