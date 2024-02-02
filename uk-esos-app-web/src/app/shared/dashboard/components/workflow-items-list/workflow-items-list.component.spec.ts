import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ItemTypePipe } from '@shared/dashboard';
import { WorkflowItemsListComponent } from '@shared/dashboard';
import { DaysRemainingPipe } from '@shared/pipes/days-remaining.pipe';
import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';
import { ItemNamePipe } from '@shared/pipes/item-name.pipe';
import { UserFullNamePipe } from '@shared/pipes/user-full-name.pipe';

import { TableComponent } from 'govuk-components';

import * as mocks from '../../testing';

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: '',
  template: `
    <esos-workflow-items-list
      [items]="items"
      [tableColumns]="tableColumns"
      [unassignedLabel]="'Unassigned'"
    ></esos-workflow-items-list>
  `,
})
class TestParentComponent {
  items = mocks.assignedItems;
  tableColumns = mocks.columns;
}

describe('WorkflowItemsListComponent', () => {
  let component: TestParentComponent;
  let fixture: ComponentFixture<TestParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ItemLinkPipe, ItemNamePipe, DaysRemainingPipe, TableComponent],
      declarations: [TestParentComponent, WorkflowItemsListComponent, ItemTypePipe, UserFullNamePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TestParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show data in table', () => {
    const cells = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('td'));
    expect(cells.map((cell) => cell.textContent.trim())).toEqual([
      ...['Review organisation account application', 'TEST_FN TEST_LN', '10', 'ACCOUNT_3'],
    ]);
  });
});
