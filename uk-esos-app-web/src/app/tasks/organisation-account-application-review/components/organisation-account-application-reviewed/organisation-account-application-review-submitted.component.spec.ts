import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { SharedModule } from '@shared/shared.module';

import { OrganisationAccountApplicationReviewSubmittedComponent } from './organisation-account-application-review-submitted.component';

describe('OrganisationAccountApplicationReviewSubmittedComponent', () => {
  let component: OrganisationAccountApplicationReviewSubmittedComponent;
  let fixture: ComponentFixture<OrganisationAccountApplicationReviewSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, OrganisationAccountApplicationReviewSubmittedComponent, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ isAccepted: 'true' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationAccountApplicationReviewSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly interpret the accepted query param', () => {
    expect(component.isReviewAccepted).toBeTruthy();
  });

  it('should display the approved message when accepted', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('You have approved the organisation account application');
  });

  it('should display the rejected message when not accepted', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [OrganisationAccountApplicationReviewSubmittedComponent, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ isAccepted: 'false' }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(OrganisationAccountApplicationReviewSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('You have rejected the organisation account application');
  });
});
