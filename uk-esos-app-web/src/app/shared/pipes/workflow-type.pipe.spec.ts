import { WorkflowTypePipe } from './workflow-type.pipe';

describe('WorkflowTypePipe', () => {
  let pipe: WorkflowTypePipe;

  beforeEach(() => (pipe = new WorkflowTypePipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should properly transform workflow types', () => {
    expect(pipe.transform('ORGANISATION_ACCOUNT_OPENING')).toEqual('Account creation');

    expect(pipe.transform(undefined)).toEqual(null);
  });
});
