import { CoordinatesDTO } from 'esos-api';

export interface Coordinates {
  degree: number;
  minute: number;
  second: number;
  cardinalDirection: CoordinatesDTO['cardinalDirection'];
}
