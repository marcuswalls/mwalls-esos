import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { BasePage } from '@testing';
import EnergyConsumptionComponent from '@timeline/notification/subtasks/energy-consumption/energy-consumption.component';
import { mockRequestActionState } from '@timeline/notification/testing/mock-data';

describe('EnergyConsumptionComponent', () => {
  let component: EnergyConsumptionComponent;
  let fixture: ComponentFixture<EnergyConsumptionComponent>;
  let store: RequestActionStore;
  let page: Page;

  class Page extends BasePage<EnergyConsumptionComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestActionStore],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(RequestActionStore);
    store.setState(mockRequestActionState);

    fixture = TestBed.createComponent(EnergyConsumptionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show summary values', () => {
    expect(page.summaryListValues).toEqual([
      ['Buildings', '100 kWh'],
      ['Transport', '0 kWh'],
      ['Industrial processes', '50 kWh'],
      ['Other processes', '0 kWh'],
      ['Total', '150 kWh'],
      ['Yes'],
      ['Buildings', '100 kWh'],
      ['Transport', '0 kWh'],
      ['Industrial processes', '45 kWh'],
      ['Other processes', '0 kWh'],
      ['Total', '145 kWh  (97% of total energy consumption)'],
      ['Intensity ratio', 'Unit'],
      ['50', 'kWh/m2'],
      ['Additional Information', 'Buildings additional information'],
      ['', 'Intensity ratio', 'Unit'],
      ['Freights', '60', 'kWh/freight miles'],
      ['Passengers', '70', 'kWh/passenger miles'],
      ['Intensity ratio', 'Unit'],
      ['80', 'kWh/tonnes'],
      ['Intensity ratio', 'Unit'],
      ['100', 'kWh/litres'],
      ['Yes Additional info'],
    ]);
  });
});
