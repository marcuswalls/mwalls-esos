import { requestActionQuery, RequestActionStore } from '@common/request-action/+state';
import { RequestActionPageContentFactory } from '@common/request-action/request-action.types';
import { TaskSection } from '@common/shared/model';
import { ItemActionTypePipe } from '@shared/pipes/item-action-type.pipe';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';
import { NotificationApplicationTimelinePayload } from '@timeline/notification/+state/notification-application.types';

import { NocP3 } from 'esos-api';

import { HIDDEN_SUBTASKS_MAP } from '../../requests/common/notification-application';
import { determineReportingObligationCategory } from '../../requests/common/reporting-obligation-category';

const routePrefix = 'notification';

export const notificationApplicationSentToEditContent: RequestActionPageContentFactory = (injector) => {
  const routePrefix = 'notification';
  const pipe = new ItemActionTypePipe();
  const action = injector.get(RequestActionStore).select(requestActionQuery.selectActionType)();
  const payload = injector.get(RequestActionStore).select(notificationApplicationTimelineQuery.selectPayload)();

  return {
    header: pipe.transform(action),
    sections: [
      {
        title: 'Reporting obligation',
        tasks: [
          {
            status: '',
            linkText: 'Reporting obligation',
            link: `${routePrefix}/reporting-obligation`,
          },
        ],
      },
      ...getVisibleSections(payload),
    ],
  };
};

function getVisibleSections(payload: NotificationApplicationTimelinePayload): TaskSection[] {
  const category = determineReportingObligationCategory(payload?.noc?.reportingObligation);

  if (!category) {
    return [];
  } else {
    return [
      getOrganisationDetailsSection(),
      getInformationOnEnergyUseSection(),
      getEnergyAssessmentContactSection(),
      getPreviousCompliancePeriodsSection(),
      getConfirmationSection(),
    ]
      .map((section) => ({
        ...section,
        tasks: section.tasks.filter((task) => !HIDDEN_SUBTASKS_MAP[category].includes(task.name as keyof NocP3)),
      }))
      .filter((section) => section.tasks.length > 0);
  }
}

function getOrganisationDetailsSection(): TaskSection {
  return {
    title: 'Organisation details',
    tasks: [
      {
        name: 'responsibleUndertaking',
        status: '',
        linkText: 'Responsible undertaking',
        link: `${routePrefix}/responsible-undertaking`,
      },
      {
        name: 'contactPersons',
        status: '',
        linkText: 'Contact persons',
        link: `${routePrefix}/contact-persons`,
      },
      {
        name: 'organisationStructure',
        status: '',
        linkText: 'Organisation structure',
        link: `${routePrefix}/organisation-structure`,
      },
    ],
  };
}

function getInformationOnEnergyUseSection(): TaskSection {
  return {
    title: 'Information on energy use',
    tasks: [
      {
        name: 'complianceRoute',
        status: '',
        linkText: 'Compliance route',
        link: `${routePrefix}/compliance-route`,
      },
      {
        name: 'energyConsumptionDetails',
        status: '',
        linkText: 'Energy consumption',
        link: `${routePrefix}/energy-consumption`,
      },
      {
        name: 'energySavingsOpportunities',
        status: '',
        linkText: 'Energy savings opportunities',
        link: `${routePrefix}/energy-savings-opportunities`,
      },
      {
        name: 'alternativeComplianceRoutes',
        status: '',
        linkText: 'Alternative routes to compliance',
        link: `${routePrefix}/alternative-compliance-routes`,
      },
      {
        name: 'energySavingsAchieved',
        status: '',
        linkText: 'Energy savings achieved',
        link: `${routePrefix}/energy-savings-achieved`,
      },
    ],
  };
}

function getEnergyAssessmentContactSection(): TaskSection {
  return {
    title: 'Energy assessment contact',
    tasks: [
      {
        name: 'leadAssessor',
        status: '',
        linkText: 'Lead assessor details',
        link: `${routePrefix}/lead-assessor-details`,
      },
      {
        name: 'assessmentPersonnel',
        status: '',
        linkText: 'Assessment personnel',
        link: `${routePrefix}/assessment-personnel`,
      },
    ],
  };
}

function getPreviousCompliancePeriodsSection(): TaskSection {
  return {
    title: 'Previous compliance periods',
    tasks: [
      {
        name: 'secondCompliancePeriod',
        status: '',
        linkText: 'Second compliance period',
        link: `${routePrefix}/second-compliance-period`,
      },
      {
        name: 'firstCompliancePeriod',
        status: '',
        linkText: 'First compliance period',
        link: `${routePrefix}/first-compliance-period`,
      },
    ],
  };
}

function getConfirmationSection(): TaskSection {
  return {
    title: 'Confirmation',
    tasks: [
      {
        name: 'confirmations',
        status: '',
        linkText: 'Confirmation',
        link: `${routePrefix}/confirmation`,
      },
    ],
  };
}
