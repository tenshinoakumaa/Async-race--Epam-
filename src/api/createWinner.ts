import { CreateWinnerResponse, Winner } from "../types/types";
import { WINNERS } from "./variables";

const createWinner: CreateWinnerResponse = async (
  body: Winner
): Promise<Winner> =>
  (
    await fetch(WINNERS, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

export default createWinner;
