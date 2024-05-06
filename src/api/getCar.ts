import { Car, GetCarResponse } from "../types/types";
import { GARAGE } from "./variables";

const getCar: GetCarResponse = async (id: number): Promise<Car> =>
  (await fetch(`${GARAGE}/${id}`)).json();

export default getCar;
