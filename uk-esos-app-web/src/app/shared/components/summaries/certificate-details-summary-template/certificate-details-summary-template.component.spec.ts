import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CertificateDetailsSummaryTemplateComponent } from '@shared/components/summaries';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('CertificateDetailsSummaryTemplateComponent', () => {
  let component: CertificateDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<CertificateDetailsSummaryTemplateComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<CertificateDetailsSummaryTemplateComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });
    fixture = TestBed.createComponent(CertificateDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.isEditable = true;
    component.certificateDetails = {
      certificateNumber: 'iso1',
      validFrom: '2022-01-01T00:00:00.000Z',
      validUntil: '2024-01-01T00:00:00.000Z',
    };
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaries).toEqual([
      'Certificate number',
      'iso1',
      'Change',
      'Valid from',
      '1 Jan 2022',
      'Change',
      'Valid until',
      '1 Jan 2024',
      'Change',
    ]);
  });
});
