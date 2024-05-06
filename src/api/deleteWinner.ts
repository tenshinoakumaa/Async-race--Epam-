import { WINNERS } from "./variables";

const deleteWinner = async (id: number): Promise<void> =>
  (await fetch(`${WINNERS}/${id}`, { method: "DELETE" })).json();

export default deleteWinner;
