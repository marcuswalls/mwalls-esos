import { Pipe, PipeTransform } from '@angular/core';

import { TaskItemStatus } from '@tasks/task-item-status';

@Pipe({
  name: 'statusTagText',
  standalone: true,
  pure: true,
})
export class StatusTagTextPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case TaskItemStatus.NOT_STARTED:
        return 'NOT STARTED';
      case TaskItemStatus.CANNOT_START_YET:
        return 'CANNOT START YET';
      case TaskItemStatus.COMPLETED:
        return 'COMPLETED';
      case TaskItemStatus.APPROVED:
        return 'APPROVED';
      case TaskItemStatus.REJECTED:
        return 'REJECTED';
      case TaskItemStatus.IN_PROGRESS:
        return 'IN PROGRESS';
      default:
        return null;
    }
  }
}
