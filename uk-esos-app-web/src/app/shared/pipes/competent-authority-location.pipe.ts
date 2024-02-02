import { Pipe, PipeTransform } from '@angular/core';

import { regulatorSchemeMap } from '@shared/interfaces/regulator-scheme';

@Pipe({ name: 'competentAuthorityLocation', standalone: true })
export class CompetentAuthorityLocationPipe implements PipeTransform {
  transform(value: string): string {
    return Object.entries(regulatorSchemeMap).find(([target]) => target === value)[1];
  }
}
