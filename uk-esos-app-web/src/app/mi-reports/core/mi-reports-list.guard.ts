import { Injectable } from '@angular/core';
import { CanActivate, Resolve } from '@angular/router';

import { map, Observable, tap } from 'rxjs';

import { EsosAccount } from '@core/store/auth';

import { MiReportSearchResult, MiReportsService } from 'esos-api';

@Injectable({ providedIn: 'root' })
export class MiReportsListGuard implements CanActivate, Resolve<MiReportSearchResult[]> {
  miReports: MiReportSearchResult[];

  constructor(private readonly miReportsService: MiReportsService) {}

  canActivate(): Observable<boolean> {
    return this.miReportsService.getCurrentUserMiReports(EsosAccount).pipe(
      tap((result) => (this.miReports = result)),
      map(() => true),
    );
  }

  resolve(): MiReportSearchResult[] {
    return this.miReports;
  }
}
