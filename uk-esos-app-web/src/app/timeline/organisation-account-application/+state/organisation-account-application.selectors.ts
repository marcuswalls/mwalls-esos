import { requestActionQuery, RequestActionState } from '@common/request-action/+state';
import { createDescendingSelector, StateSelector } from '@common/store';

import {
  AccountOpeningDecisionPayload,
  OrganisationAccountOpeningDecisionSubmittedRequestActionPayload,
  OrganisationAccountPayload,
  OrganisationParticipantDetails,
} from 'esos-api';

import { OrganisationAccountApplicationTimelinePayload } from './organisation-account-application.types';

const selectPayload: StateSelector<RequestActionState, OrganisationAccountApplicationTimelinePayload> =
  createDescendingSelector(
    requestActionQuery.selectActionPayload,
    (state) => state as OrganisationAccountApplicationTimelinePayload,
  );

const selectAccountDetails: StateSelector<RequestActionState, OrganisationAccountPayload> = createDescendingSelector(
  selectPayload,
  (state) => state.account,
);

const selectUserDetails: StateSelector<RequestActionState, OrganisationParticipantDetails> = createDescendingSelector(
  selectPayload,
  (state) => state.participantDetails,
);

const selectDecision: StateSelector<RequestActionState, AccountOpeningDecisionPayload> = createDescendingSelector(
  selectPayload,
  (state) => (state as OrganisationAccountOpeningDecisionSubmittedRequestActionPayload).decision,
);

export const organisationAccountApplicationTimelineQuery = {
  selectPayload,
  selectAccountDetails,
  selectUserDetails,
  selectDecision,
};
