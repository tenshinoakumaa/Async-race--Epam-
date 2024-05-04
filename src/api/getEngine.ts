import { EngineResponse } from "../types/types";
import { ENGINE } from "./variables";

const getEngine: EngineResponse = async (
  id: number,
  status: "started" | "stopped"
): Promise<{
  velocity: number;
  distance: number;
}> =>
  (
    await fetch(`${ENGINE}?id=${id}&status=${status}`, {
      method: "PATCH",
    })
  ).json();

export default getEngine;
