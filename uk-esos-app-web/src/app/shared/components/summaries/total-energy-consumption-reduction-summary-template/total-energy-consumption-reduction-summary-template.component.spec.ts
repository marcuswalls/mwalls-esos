import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TotalEnergyConsumptionReductionSummaryTemplateComponent } from '@shared/components/summaries';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('TotalEnergyConsumptionReductionSummaryTemplateComponent', () => {
  let component: TotalEnergyConsumptionReductionSummaryTemplateComponent;
  let fixture: ComponentFixture<TotalEnergyConsumptionReductionSummaryTemplateComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<TotalEnergyConsumptionReductionSummaryTemplateComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });
    fixture = TestBed.createComponent(TotalEnergyConsumptionReductionSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.isEditable = true;
    component.totalEnergyConsumptionReduction = 10;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaries).toEqual(['10 kWh', 'Change']);
  });
});
