import { Car, UpdateCarResponse, CarBody } from "../types/types";
import { GARAGE } from "./variables";

const updateCar: UpdateCarResponse = async (
  id: number,
  body: CarBody
): Promise<Car> =>
  (
    await fetch(`${GARAGE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

export default updateCar;
