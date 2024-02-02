import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { OrganisationAccountApplicationCancelComponent } from './organisation-account-application-cancel.component';

describe('OrganisationCancelApplicationComponent', () => {
  let component: OrganisationAccountApplicationCancelComponent;
  let fixture: ComponentFixture<OrganisationAccountApplicationCancelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrganisationAccountApplicationCancelComponent, RouterTestingModule.withRoutes([])],
    });

    fixture = TestBed.createComponent(OrganisationAccountApplicationCancelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display page heading with correct caption and size', () => {
    const pageHeading = fixture.debugElement.query(By.css('esos-page-heading'));
    const caption = pageHeading.nativeElement.getAttribute('caption');
    const size = pageHeading.nativeElement.getAttribute('size');

    expect(caption).toEqual('Cancel organisation account creation');
    expect(size).toEqual('xl');
  });

  it('should display confirmation message', () => {
    const confirmationMessage = fixture.debugElement.query(By.css('.govuk-body')).nativeElement.textContent.trim();
    expect(confirmationMessage).toEqual('The data entered will be permanently deleted. This action cannot be undone.');
  });
});
