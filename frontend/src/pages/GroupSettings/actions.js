import { redirect } from "react-router-dom";
import { removeMember, addMember } from "../../utils/api";

export const getAction = (type) => {
  switch (type) {
    case "add":
      return async ({ params }) => {
        const { groupId, memberId } = params;
        const res = await addMember(groupId, memberId);
        if (!res.ok) throw res;

        return redirect(`/groups/${groupId}/add/members`);
      };

    case "remove":
      return async ({ params }) => {
        const { groupId, memberId } = params;
        const res = await removeMember(groupId, memberId);
        if (!res.ok) throw res;

        return redirect(`/groups/${groupId}/remove/members`);
      };
  }
};
