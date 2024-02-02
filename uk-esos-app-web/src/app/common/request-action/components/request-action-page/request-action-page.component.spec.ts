import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RequestActionStore } from '@common/request-action/+state';
import { requestActionQuery } from '@common/request-action/+state/request-action.selectors';
import { REQUEST_ACTION_PAGE_CONTENT } from '@common/request-action/request-action.providers';
import { screen } from '@testing-library/angular';

import { RequestActionPageContentFactoryMap } from '../../request-action.types';
import { RequestActionPageComponent } from './request-action-page.component';

@Component({
  template: `<h1>TEST CONTENT</h1>`,
  standalone: true,
})
class MockContentComponent {}

const sections = [
  {
    title: 'TEST_SECTION_1',
    tasks: [{ link: '.', linkText: 'TEST_SUBTASK_1_1', status: 'COMPLETED' }],
  },
  {
    title: 'TEST_SECTION_2',
    tasks: [{ link: '.', linkText: 'TEST_SUBTASK_2_1', status: 'COMPLETED' }],
  },
];

function getContent(type: 'component' | 'sections'): RequestActionPageContentFactoryMap {
  return {
    ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED: (injector) => {
      const store = injector.get(RequestActionStore);
      const submitter = store.select(requestActionQuery.selectSubmitter)();
      return {
        header: `Original application submitted by ${submitter}`,
        component: type === 'component' ? MockContentComponent : undefined,
        sections: type === 'sections' ? sections : undefined,
      };
    },
  };
}

describe('RequestActionComponent', () => {
  let component: RequestActionPageComponent;
  let fixture: ComponentFixture<RequestActionPageComponent>;
  let store: RequestActionStore;

  function createTestModule(content: RequestActionPageContentFactoryMap) {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, RequestActionPageComponent],
      providers: [{ provide: REQUEST_ACTION_PAGE_CONTENT, useValue: content }],
    });

    store = TestBed.inject(RequestActionStore);
    store.setAction({
      type: 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED',
      submitter: 'Darth Vader',
    });

    fixture = TestBed.createComponent(RequestActionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createTestModule(getContent('component'));
    expect(component).toBeTruthy();
  });

  it('should show content with custom component', () => {
    createTestModule(getContent('component'));
    expect(screen.getByRole('heading', { name: 'TEST CONTENT' })).toBeVisible();
  });

  it('should show content with sections', () => {
    createTestModule(getContent('sections'));
    expect(screen.getByRole('heading', { name: 'TEST_SECTION_1' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'TEST_SUBTASK_1_1' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'TEST_SECTION_2' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'TEST_SUBTASK_2_1' })).toBeVisible();
  });
});
