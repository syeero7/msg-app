import { getUserById, getUsers } from "../../utils/api";

export const loader = async ({ params }) => {
  const { matches } = window.matchMedia("(max-width:60em)");
  const { userId } = params;
  const data = {};

  if (!matches) {
    const res = await getUsers();
    if (!res.ok) throw res;
    const { users } = await res.json();
    data.users = users;
  }

  const res = await getUserById(userId);
  if (!res.ok) throw res;
  const { user } = await res.json();
  data.user = user;

  return data;
};
