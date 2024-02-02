import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyConsumptionSummaryPageComponent } from '@shared/components/summaries';
import { BasePage } from '@testing';

describe('EnergyConsumptionSummaryPageComponent', () => {
  let component: EnergyConsumptionSummaryPageComponent;
  let fixture: ComponentFixture<EnergyConsumptionSummaryPageComponent>;
  let page: Page;

  class Page extends BasePage<EnergyConsumptionSummaryPageComponent> {
    get headers() {
      return this.queryAll<HTMLHeadElement>('h2').map((el) => el?.textContent?.trim());
    }
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
      imports: [EnergyConsumptionSummaryPageComponent],
    });

    fixture = TestBed.createComponent(EnergyConsumptionSummaryPageComponent);
    component = fixture.componentInstance;

    component.changeLink = {
      TOTAL_ENERGY: 'link',
    };
    component.data = {
      totalEnergyConsumption: {
        buildings: 100,
        transport: 0,
        industrialProcesses: 50,
        otherProcesses: 0,
        total: 150,
      },
      significantEnergyConsumptionExists: true,
      significantEnergyConsumption: {
        buildings: 100,
        transport: 0,
        industrialProcesses: 45,
        otherProcesses: 0,
        total: 145,
        significantEnergyConsumptionPct: 97,
      },
      energyIntensityRatioData: {
        buildingsIntensityRatio: {
          ratio: '50',
          unit: 'm2',
          additionalInformation: 'Buildings additional information',
        },
        freightsIntensityRatio: {
          ratio: '60',
          unit: 'freight miles',
        },
        passengersIntensityRatio: {
          ratio: '70',
          unit: 'passenger miles',
          additionalInformation: null,
        },
        industrialProcessesIntensityRatio: {
          ratio: '80',
          unit: 'tonnes',
          additionalInformation: null,
        },
        otherProcessesIntensityRatios: [
          {
            name: 'custom',
            ratio: '100',
            unit: 'litres',
            additionalInformation: null,
          },
        ],
      },
      additionalInformationExists: true,
      additionalInformation: 'Additional info',
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the headers', () => {
    expect(page.headers).toEqual([
      'What is the total energy consumption in kWh for the reference period?',
      'Have you used significant energy consumption?',
      'What is the significant energy consumption in kWh for the reference period?',
      'What is the energy intensity ratio for each organisational purpose?',
      'Buildings',
      'Transport',
      'Industrial Processes',
      'custom',
      'Do you want to add more information to give context to the energy intensity ratio?',
    ]);
  });

  it('should display the table with added persons', () => {
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
