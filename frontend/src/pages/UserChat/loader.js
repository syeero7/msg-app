import { getUsers, getDirectMessages, getUserById } from "../../utils/api";

export const getLoader = (type) => {
  switch (type) {
    case "all":
      return async () => {
        const res = await getUsers();
        if (!res.ok) throw res;
        return res.json();
      };

    case "online":
      return async () => {
        const res = await getUsers(true);
        if (!res.ok) throw res;
        return res.json();
      };

    case "messages":
      return async ({ params }) => {
        const { matches } = window.matchMedia("(max-width:60em)");
        const { userId } = params;
        const data = {};

        if (!matches) {
          const res = await getUsers();
          if (!res.ok) throw res;
          const { users } = await res.json();
          data.users = users;
        }

        const res = await getDirectMessages(userId);
        if (!res.ok) throw res;
        const { messages } = await res.json();
        data.messages = messages;

        const res2 = await getUserById(userId);
        if (!res2.ok) throw res2;
        const { user } = await res2.json();
        data.data = user;

        return data;
      };
  }
};
