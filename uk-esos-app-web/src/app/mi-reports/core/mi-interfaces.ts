import { MiReportResult } from 'esos-api';

export interface ExtendedMiReportResult extends MiReportResult {
  results: Array<any>;
}
