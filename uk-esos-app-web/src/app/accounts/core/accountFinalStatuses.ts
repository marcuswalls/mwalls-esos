import { OrganisationAccountDTO } from 'esos-api';

export function accountFinalStatuses(status: OrganisationAccountDTO['status']): boolean {
  return status !== 'UNAPPROVED' && status !== 'DENIED';
}
