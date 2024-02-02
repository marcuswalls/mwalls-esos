import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@testing';

import { EnergySavingsDetailsSummaryTemplateComponent } from './energy-savings-details-summary-template.component';

describe('EnergySavingsDetailsSummaryTemplateComponent', () => {
  let component: EnergySavingsDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<EnergySavingsDetailsSummaryTemplateComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsDetailsSummaryTemplateComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });

    fixture = TestBed.createComponent(EnergySavingsDetailsSummaryTemplateComponent);

    component = fixture.componentInstance;
    component.isEditable = true;
    component.energySavingsDetails = 'lorem ipsum';

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all fields', () => {
    expect(page.summaries).toEqual(['lorem ipsum', 'Change']);
  });
});
