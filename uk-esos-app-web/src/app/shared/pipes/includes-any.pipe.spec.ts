import { IncludesAnyPipe } from './includes-any.pipe';

describe('IncludesAnyPipe', () => {
  let pipe: IncludesAnyPipe;

  beforeAll(() => (pipe = new IncludesAnyPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return false if no common values exist between arrays', () => {
    expect(pipe.transform(['VALUE_A', 'VALUE_B'], ['VALUE_C', 'VALUE_D'])).toEqual(false);
  });

  it('should return true if at least one value is equal', () => {
    expect(pipe.transform(['VALUE_A', 'VALUE_B'], ['VALUE_A', 'VALUE_C'])).toEqual(true);
  });

  it('should return false if array is null', () => {
    expect(pipe.transform(null, ['VALUE_A', 'VALUE_C'])).toEqual(false);
  });

  it('should return false if array is empty', () => {
    expect(pipe.transform([], ['VALUE_A', 'VALUE_C'])).toEqual(false);
  });
});
