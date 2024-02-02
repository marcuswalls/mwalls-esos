import { Routes } from '@angular/router';

import { responsibleUndertakingMap } from '@shared/subtask-list-maps/subtask-list-maps';

export const NOTIFICATION_TIMELINE_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reporting-obligation',
        title: 'Reporting obligation',
        data: { breadcrumb: 'Reporting obligation' },
        loadComponent: () => import('./subtasks/reporting-obligation/reporting-obligation.component'),
      },
      {
        path: 'responsible-undertaking',
        title: `${responsibleUndertakingMap.title}`,
        data: { breadcrumb: `${responsibleUndertakingMap.title}` },
        loadComponent: () => import('./subtasks/responsible-undertaking/responsible-undertaking.component'),
      },
      {
        path: 'contact-persons',
        title: 'Contact persons',
        data: { breadcrumb: 'Contact persons' },
        loadComponent: () => import('./subtasks/contact-persons/contact-persons.component'),
      },
      {
        path: 'organisation-structure',
        title: 'Organisation structure',
        data: { breadcrumb: 'Organisation structure' },
        loadComponent: () => import('./subtasks/organisation-structure/organisation-structure.component'),
      },
      {
        path: 'compliance-route',
        title: 'Compliance route',
        data: { breadcrumb: 'Compliance route' },
        loadComponent: () => import('./subtasks/compliance-route/compliance-route.component'),
      },
      {
        path: 'energy-consumption',
        title: 'Energy consumption',
        data: { breadcrumb: 'Energy consumption' },
        loadComponent: () => import('./subtasks/energy-consumption/energy-consumption.component'),
      },
      {
        path: 'energy-savings-opportunities',
        title: 'Energy savings opportunities',
        data: { breadcrumb: 'Energy savings opportunities' },
        loadComponent: () => import('./subtasks/energy-savings-opportunities/energy-savings-opportunities.component'),
      },
      {
        path: 'alternative-compliance-routes',
        title: 'Alternative routes to compliance',
        data: { breadcrumb: 'Alternative routes to compliance' },
        loadComponent: () => import('./subtasks/alternative-compliance-routes/alternative-compliance-routes.component'),
      },
      {
        path: 'energy-savings-achieved',
        title: 'Energy savings achieved',
        data: { breadcrumb: 'Energy savings achieved' },
        loadComponent: () => import('./subtasks/energy-savings-achieved/energy-savings-achieved.component'),
      },
      {
        path: 'lead-assessor-details',
        title: 'Lead assessor details',
        data: { breadcrumb: 'Lead assessor details' },
        loadComponent: () => import('./subtasks/lead-assessor-details/lead-assessor-details.component'),
      },
      {
        path: 'assessment-personnel',
        title: 'Assessment personnel',
        data: { breadcrumb: 'Assessment personnel' },
        loadComponent: () => import('./subtasks/assessment-personnel/assessment-personnel.component'),
      },
      {
        path: 'first-compliance-period',
        title: 'First compliance period',
        data: { breadcrumb: 'First compliance period' },
        loadComponent: () => import('./subtasks/first-compliance-period/first-compliance-period.component'),
      },
      {
        path: 'second-compliance-period',
        title: 'Second compliance period',
        data: { breadcrumb: 'Second compliance period' },
        loadComponent: () => import('./subtasks/second-compliance-period/second-compliance-period.component'),
      },
      {
        path: 'confirmation',
        title: 'Confirmation',
        data: { breadcrumb: 'Confirmation' },
        loadComponent: () => import('./subtasks/confirmation/confirmation.component'),
      },
    ],
  },
];
