import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@testing';

import { EnergySavingsTotalEstimationSummaryTemplateComponent } from './energy-savings-total-estimation-summary-template.component';

describe('EnergySavingsTotalEstimationSummaryTemplateComponent', () => {
  let component: EnergySavingsTotalEstimationSummaryTemplateComponent;
  let fixture: ComponentFixture<EnergySavingsTotalEstimationSummaryTemplateComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsTotalEstimationSummaryTemplateComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });

    fixture = TestBed.createComponent(EnergySavingsTotalEstimationSummaryTemplateComponent);

    component = fixture.componentInstance;
    component.isEditable = true;
    component.totalEnergySavingsEstimation = 100;

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all fields', () => {
    expect(page.summaries).toEqual(['100 kWh', 'Change']);
  });
});
