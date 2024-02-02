import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibilityTypesComponent } from './responsibility-types.component';

describe('ResponsibilityTypesComponent', () => {
  let component: ResponsibilityTypesComponent;
  let fixture: ComponentFixture<ResponsibilityTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsibilityTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibilityTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
