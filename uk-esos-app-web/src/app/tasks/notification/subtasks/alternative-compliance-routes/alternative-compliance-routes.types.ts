import { AlternativeComplianceRoutes } from 'esos-api';

export type CertificateDetailsStep = keyof Pick<
  AlternativeComplianceRoutes,
  'iso50001CertificateDetails' | 'decCertificatesDetails' | 'gdaCertificatesDetails'
>;
