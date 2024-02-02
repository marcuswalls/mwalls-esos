import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phases',
  standalone: true,
})
export class PhasesPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'PHASE_3':
        return 'Phase 3';
    }
    return value;
  }
}
