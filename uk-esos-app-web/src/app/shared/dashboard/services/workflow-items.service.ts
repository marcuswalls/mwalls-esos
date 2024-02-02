import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { EsosAccount } from '@core/store';

import {
  ItemDTOResponse,
  ItemsAssignedToMeService,
  ItemsAssignedToOthersService,
  UnassignedItemsService,
} from 'esos-api';

import { WorkflowItemsAssignmentType } from '../store';

@Injectable()
export class WorkflowItemsService {
  constructor(
    private readonly itemsAssignedToMeService: ItemsAssignedToMeService,
    private readonly itemsAssignedToOthersService: ItemsAssignedToOthersService,
    private readonly unassignedItemsService: UnassignedItemsService,
  ) {}

  getItems(type: WorkflowItemsAssignmentType, page: number, pageSize: number): Observable<ItemDTOResponse> {
    const serviceMethod = this.getServiceMethod(type);
    return serviceMethod(EsosAccount, page - 1, pageSize);
  }

  private getServiceMethod(type: WorkflowItemsAssignmentType) {
    switch (type) {
      case 'unassigned':
        return this.unassignedItemsService.getUnassignedItems.bind(this.unassignedItemsService);
      case 'assigned-to-others':
        return this.itemsAssignedToOthersService.getAssignedToOthersItems.bind(this.itemsAssignedToOthersService);
      case 'assigned-to-me':
      default:
        return this.itemsAssignedToMeService.getAssignedItems.bind(this.itemsAssignedToMeService);
    }
  }
}
