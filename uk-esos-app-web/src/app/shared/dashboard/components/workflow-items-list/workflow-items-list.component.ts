import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GovukTableColumn } from 'govuk-components';

import { ItemDTO } from 'esos-api';

@Component({
  selector: 'esos-workflow-items-list',
  templateUrl: './workflow-items-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowItemsListComponent {
  @Input() items: ItemDTO[];
  @Input() tableColumns: GovukTableColumn<ItemDTO>[];
  @Input() unassignedLabel: string;
}
