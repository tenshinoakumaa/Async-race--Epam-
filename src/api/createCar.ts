import { Car, CreateCarResponse, CarBody } from '../types/types';
import { GARAGE } from './variables';

const createCar: CreateCarResponse = async (body: CarBody): Promise<Car> =>
  (
    await fetch(GARAGE, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export default createCar;