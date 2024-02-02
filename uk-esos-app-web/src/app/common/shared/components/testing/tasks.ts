import { TaskItem } from '@common/shared/model/task-list';

export const tasks: TaskItem[] = [
  {
    linkText: 'Type A',
    status: 'NOT_STARTED',
    link: 'task-a',
  },
  {
    linkText: 'Type B',
    status: 'CANNOT_START_YET',
    link: 'task-b',
  },
  {
    linkText: 'Type C',
    status: 'IN_PROGRESS',
    link: 'task-c',
  },
  {
    linkText: 'Type E',
    status: 'COMPLETED',
    link: 'task-e',
  },
];
