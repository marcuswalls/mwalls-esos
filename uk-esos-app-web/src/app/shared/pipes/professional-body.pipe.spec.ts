import { ProfessionalBodyPipe } from './professional-body.pipe';

describe('ProfessionalBodyPipe', () => {
  let pipe: ProfessionalBodyPipe;

  beforeEach(() => (pipe = new ProfessionalBodyPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('hould properly transform account types', () => {
    expect(pipe.transform('ASSOCIATION_OF_ENERGY_ENGINEERS')).toEqual('Association of Energy Engineers');
    expect(pipe.transform('CIBSE_THE_CHARTERED_INSTITUTION_OF_BUILDING_SERVICES_ENGINEERS')).toEqual(
      'CIBSE (The Chartered Institution of Building Services Engineers)',
    );
    expect(pipe.transform('ELMHURST_ENERGY_SYSTEMS')).toEqual('Elmhurst Energy Systems');
    expect(pipe.transform('ENERGY_INSTITUTE')).toEqual('Energy Institute');
    expect(pipe.transform('ENERGY_MANAGERS_ASSOCIATION')).toEqual('Energy Managers Association');
    expect(pipe.transform('INSTITUTION_OF_CHEMICAL_ENGINEERS')).toEqual('Institution of Chemical Engineers');
    expect(pipe.transform('INSTITUTE_OF_ENVIRONMENTAL_MANAGEMENT_AND_ASSESSMENT')).toEqual(
      'Institute of Environmental Management and Assessment',
    );
    expect(pipe.transform('QUIDOS')).toEqual('Quidos');
    expect(pipe.transform('STROMA_CERTIFICATION_LTD')).toEqual('Stroma Certification Ltd');
    expect(pipe.transform(undefined)).toEqual(null);
  });
});
