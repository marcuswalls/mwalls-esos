import { ContactPerson, OperatorUserRegistrationDTO } from 'esos-api';

export type ContactPersonNew = ContactPerson & { address: OperatorUserRegistrationDTO['address'] };
