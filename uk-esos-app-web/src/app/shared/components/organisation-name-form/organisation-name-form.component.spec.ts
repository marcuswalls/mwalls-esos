import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { mockCreateOrganisationAccountStateProvider } from '@accounts/organisation-account-application/testing/mock-create-organisation-account.state.provider';
import { mockOrganisationAccountStore } from '@accounts/organisation-account-application/testing/mock-organisation-account.store';
import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { OrganisationAccountStore } from '../../../accounts/organisation-account-application/+state';
import { OrganisationNameFormComponent } from './organisation-name-form.component';

describe('OrganisationNameFormComponent', () => {
  let component: OrganisationNameFormComponent;
  let fixture: ComponentFixture<OrganisationNameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationNameFormComponent],
      providers: [
        { provide: OrganisationAccountStore, useValue: mockOrganisationAccountStore },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationNameFormComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({
      registeredName: new UntypedFormControl(''),
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
      component.formGroup.get('registeredName').setValue(null);
      component.formGroup.updateValueAndValidity();
      component.formGroup.markAsPristine();

      fixture.detectChanges();
      await fixture.whenStable();

      component.onSubmit();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });
});
