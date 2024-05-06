import {
  WinnerCar,
  Winner,
  WinnerProps,
  WinnersResponse,
} from "../types/types";
import getCar from "./getCar";
import { WINNERS, WINNERS_LIMIT } from "./variables";

const getWinners = async ({
  pageNumber,
  sort,
  order,
}: WinnerProps): Promise<WinnersResponse> => {
  const response: Response = await fetch(
    `${WINNERS}?_page=${pageNumber}&_limit=${WINNERS_LIMIT}&_sort=${sort}&_order=${order}}`
  );
  const items: Winner[] = await response.json();
  const count: string | null = response.headers.get("X-Total-Count");

  if (!count) {
    throw new Error("X-Total-Count is null");
  }

  return {
    items: await Promise.all(
      items.map(
        async (winner: Winner): Promise<WinnerCar> => ({
          ...winner,
          car: await getCar(winner.id),
        })
      )
    ),
    count,
  };
};

export default getWinners;
