import { GetWinnerResponse, Winner } from "../types/types";
import { WINNERS } from "./variables";

const getWinner: GetWinnerResponse = async (id: number): Promise<Winner> =>
  (await fetch(`${WINNERS}/${id}`)).json();

export default getWinner;
