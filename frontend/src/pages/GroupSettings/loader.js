import { getMembers, getNonMembers, getGroupById } from "../../utils/api";

export const getLoader = (type) => {
  return async ({ params }) => {
    const { groupId } = params;
    const data = {};

    const res = await getGroupById(groupId);
    if (!res.ok) throw res;
    const { group } = await res.json();
    data.group = group;

    if (type === "add") {
      const res = await getNonMembers(groupId);
      if (!res.ok) throw res;
      const { users } = await res.json();

      data.users = users;
    }

    if (type === "remove") {
      const res = await getMembers(groupId);
      if (!res.ok) throw res;
      const { members } = await res.json();

      data.members = members;
    }

    return data;
  };
};
