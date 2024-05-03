import { DeleteCarResponse } from '../types/types';
import { GARAGE } from './variables';

const deletetCar: DeleteCarResponse = async (id: number): Promise<void> =>
  (await fetch(`${GARAGE}/${id}`, { method: 'DELETE' })).json();

export default deletetCar;