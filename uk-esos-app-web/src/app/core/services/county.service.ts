import { Injectable } from '@angular/core';

import { map, Observable, shareReplay } from 'rxjs';

import { County } from '@core/models/county';

import { ReferenceDataService } from 'esos-api';

@Injectable({ providedIn: 'root' })
export class CountyService {
  private counties$: Observable<County[]> = this.referenceDataService.getReferenceData(['COUNTIES']).pipe(
    map((response) => response.COUNTIES as County[]),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  constructor(private readonly referenceDataService: ReferenceDataService) {}

  getUkCounties(): Observable<County[]> {
    return this.counties$;
  }
}
