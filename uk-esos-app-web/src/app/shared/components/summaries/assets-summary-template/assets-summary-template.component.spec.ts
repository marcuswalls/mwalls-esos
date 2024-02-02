import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AssetsSummaryTemplateComponent } from '@shared/components/summaries';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('AssetsSummaryTemplateComponent', () => {
  let component: AssetsSummaryTemplateComponent;
  let fixture: ComponentFixture<AssetsSummaryTemplateComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<AssetsSummaryTemplateComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });
    fixture = TestBed.createComponent(AssetsSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.isEditable = true;
    component.assets = {
      iso50001: 'iso1',
      dec: 'dec1',
      gda: 'gda1',
    };
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaries).toEqual([
      'ISO 50001',
      'iso1',
      'Change',
      'Display Energy Certificate (DECs)',
      'dec1',
      'Change',
      'Green Deal Assessment',
      'gda1',
      'Change',
    ]);
  });
});
