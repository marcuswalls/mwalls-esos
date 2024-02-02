import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RequestTaskStore } from '@common/request-task/+state';

import { SendToRestrictedSuccessComponent } from './send-to-restricted-success.component';

describe('SendToRestrictedSuccessComponent', () => {
  let component: SendToRestrictedSuccessComponent;
  let fixture: ComponentFixture<SendToRestrictedSuccessComponent>;
  let store: RequestTaskStore;
  let router: Router;
  let route: ActivatedRoute;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RequestTaskStore,
        Location,
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    });
    store = TestBed.inject(RequestTaskStore);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    location = TestBed.inject(Location);
    component = new SendToRestrictedSuccessComponent(store, router, route, location);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToRestrictedSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get state from router', () => {
    (component as any).state = { participantFullName: 'John Doe' };
    router.navigate(['success']);

    fixture.detectChanges();

    expect((component as any).state).toEqual({
      participantFullName: 'John Doe',
    });
  });

  it('should navigate to root if state is missing participant name', () => {
    const spy = jest.spyOn(router, 'navigate');
    (component as any).state = {};
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(['/']);
  });

  it('should replace state on destroy', () => {
    const spy = jest.spyOn(location, 'replaceState');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith('');
  });
});
