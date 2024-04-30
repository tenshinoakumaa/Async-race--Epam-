import { CarsResponse, GetCarsResponse } from "../types/types";
import { GARAGE, GARAGE_LIMIT } from "./variables";

const getCars: GetCarsResponse = async (
  page: number
): Promise<CarsResponse> => {
  const response: Response = await fetch(
    `${GARAGE}?_page=${page}&_limit=${GARAGE_LIMIT}`
  );
  const count: string | null = response.headers.get("X-Total-Count");

  if (!count) {
    throw new Error("X-Total-Count is null");
  }

  return {
    items: await response.json(),
    count,
  };
};

export default getCars;
