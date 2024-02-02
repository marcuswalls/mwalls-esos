import { OrganisationAccountOpeningSubmitApplicationCreateActionPayload } from 'esos-api';

export type CompetentAuthority = Exclude<
  OrganisationAccountOpeningSubmitApplicationCreateActionPayload['competentAuthority'],
  'OPRED'
>;

export const competentAuthorityMap: Record<CompetentAuthority, string> = {
  ENGLAND: 'England',
  WALES: 'Wales',
  SCOTLAND: 'Scotland',
  NORTHERN_IRELAND: 'Northern Ireland',
};
