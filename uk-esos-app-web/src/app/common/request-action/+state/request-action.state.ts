import { RequestActionDTO } from 'esos-api';

export interface RequestActionState {
  action: RequestActionDTO;
}

export const initialState: RequestActionState = {
  action: null,
};
