import { getItem } from "../../utils/localStorage";
import { getUserById } from "../../utils/api";

export const loader = async () => {
  const user = getItem();
  const res = await getUserById(user.id);
  if (!res.ok) throw res;
  return res.json();
};
