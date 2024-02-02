import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@testing';

import { ReturnToSubmitTaskButtonsComponent } from './return-to-submit-task-buttons.component';

describe('ReturnToSubmitTaskButtonsComponent', () => {
  let component: ReturnToSubmitTaskButtonsComponent;
  let fixture: ComponentFixture<ReturnToSubmitTaskButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });
    fixture = TestBed.createComponent(ReturnToSubmitTaskButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
