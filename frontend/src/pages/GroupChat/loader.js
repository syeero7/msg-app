import { getUserGroups, getGroupMessages, getGroupById } from "../../utils/api";

export const getLoader = (type) => {
  switch (type) {
    case "all":
      return async () => {
        const res = await getUserGroups();
        if (!res.ok) throw res;
        return res.json();
      };

    case "messages":
      return async ({ params }) => {
        const { matches } = window.matchMedia("(max-width:60em)");
        const { groupId } = params;
        const data = {};

        if (!matches) {
          const res = await getUserGroups();
          if (!res.ok) throw res;
          const { groups } = await res.json();
          data.groups = groups;
        }

        const res = await getGroupMessages(groupId);
        if (!res.ok) throw res;
        const { messages } = await res.json();
        data.messages = messages;

        const res2 = await getGroupById(groupId);
        if (!res2.ok) throw res2;
        const { group } = await res2.json();
        data.data = group;

        return data;
      };
  }
};
