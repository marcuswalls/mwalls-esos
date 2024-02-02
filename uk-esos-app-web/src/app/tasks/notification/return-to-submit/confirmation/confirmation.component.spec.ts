import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@testing';

import { ReturnToSubmitConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ReturnToSubmitConfirmationComponent;
  let fixture: ComponentFixture<ReturnToSubmitConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });
    fixture = TestBed.createComponent(ReturnToSubmitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
