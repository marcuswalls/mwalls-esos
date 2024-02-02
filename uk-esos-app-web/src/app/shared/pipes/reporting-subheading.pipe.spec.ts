import { ReportingSubheadingPipe } from './reporting-subheading.pipe';

describe('ReportingSubheadingPipe', () => {
  let pipe: ReportingSubheadingPipe;

  beforeEach(() => (pipe = new ReportingSubheadingPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
