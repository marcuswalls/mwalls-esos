import { Pipe, PipeTransform } from '@angular/core';

import { RequestMetadata } from 'esos-api';

@Pipe({ name: 'reportingSubheading' })
export class ReportingSubheadingPipe implements PipeTransform {
  transform(metadata: RequestMetadata): string {
    switch (metadata.type) {
      default:
        return '';
    }
  }
}
