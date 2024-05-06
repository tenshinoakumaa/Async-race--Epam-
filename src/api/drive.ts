import { DriveResponse } from "../types/types";
import { ENGINE } from "./variables";

const drive: DriveResponse = async (id: number): Promise<true | false> => {
  const res: Response = await fetch(`${ENGINE}?id=${id}&status=drive`, {
    method: "PATCH",
  }).catch();
  return res.status !== 200 ? { success: false } : { ...(await res.json()) };
};

export default drive;
