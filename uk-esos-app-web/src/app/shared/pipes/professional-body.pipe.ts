import { Pipe, PipeTransform } from '@angular/core';

import { LeadAssessorDetails } from 'esos-api';

@Pipe({ name: 'professionalBody', standalone: true })
export class ProfessionalBodyPipe implements PipeTransform {
  transform(body?: LeadAssessorDetails['professionalBody']): string {
    if (!body) {
      return null;
    }

    switch (body) {
      case 'ASSOCIATION_OF_ENERGY_ENGINEERS':
        return 'Association of Energy Engineers';
      case 'CIBSE_THE_CHARTERED_INSTITUTION_OF_BUILDING_SERVICES_ENGINEERS':
        return 'CIBSE (The Chartered Institution of Building Services Engineers)';
      case 'ELMHURST_ENERGY_SYSTEMS':
        return 'Elmhurst Energy Systems';
      case 'ENERGY_INSTITUTE':
        return 'Energy Institute';
      case 'ENERGY_MANAGERS_ASSOCIATION':
        return 'Energy Managers Association';
      case 'INSTITUTION_OF_CHEMICAL_ENGINEERS':
        return 'Institution of Chemical Engineers';
      case 'INSTITUTE_OF_ENVIRONMENTAL_MANAGEMENT_AND_ASSESSMENT':
        return 'Institute of Environmental Management and Assessment';
      case 'QUIDOS':
        return 'Quidos';
      case 'STROMA_CERTIFICATION_LTD':
        return 'Stroma Certification Ltd';

      default:
        return null;
    }
  }
}
