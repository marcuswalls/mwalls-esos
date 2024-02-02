import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationWaitForEditComponent } from './wait-for-edit.component';

describe('WaitForEditComponent', () => {
  let component: NotificationWaitForEditComponent;
  let fixture: ComponentFixture<NotificationWaitForEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(NotificationWaitForEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
