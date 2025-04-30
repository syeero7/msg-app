import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const App = lazy(() => import("./App"));
const RouteController = lazy(() => import("./components/RouteController"));

const Home = lazy(() => import("./pages/Home"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const UserChat = lazy(() => import("./pages/UserChat"));
const GroupChat = lazy(() => import("./pages/GroupChat"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const GroupSettings = lazy(() => import("./pages/GroupSettings"));

import { getLoader as getUserChatLoader } from "./pages/UserChat";
import { getLoader as getGroupChatLoader } from "./pages/GroupChat";
import { loader as userProfileLoader } from "./pages/UserProfile";
import { loader as editProfileLoader } from "./pages/EditProfile";
import {
  getLoader as getMembersLoader,
  getAction as getMembersAction,
} from "./pages/GroupSettings";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        element: <RouteController type="public" />,
        children: [
          { index: true, Component: Home },
          { path: "sign-in", Component: Signin },
          { path: "sign-up", Component: Signup },
        ],
      },
      {
        element: <RouteController type="private" />,
        children: [
          {
            path: "chat/users",
            children: [
              {
                path: "all",
                Component: UserChat,
                loader: getUserChatLoader("all"),
              },
              {
                path: "online",
                Component: UserChat,
                loader: getUserChatLoader("online"),
              },
              {
                path: ":userId",
                Component: UserChat,
                loader: getUserChatLoader("messages"),
              },
            ],
          },
          {
            path: "chat/groups",
            children: [
              {
                index: true,
                Component: GroupChat,
                loader: getGroupChatLoader("all"),
              },
              {
                path: ":groupId",
                Component: GroupChat,
                loader: getGroupChatLoader("messages"),
              },
            ],
          },
          {
            path: "users/:userId",
            Component: UserProfile,
            loader: userProfileLoader,
          },
          {
            path: "profile/edit",
            Component: EditProfile,
            loader: editProfileLoader,
          },
          {
            path: "groups/:groupId/members",
            children: [
              {
                path: "add",
                Component: GroupSettings,
                loader: getMembersLoader("add"),
                children: [
                  {
                    path: ":memberId",
                    action: getMembersAction("add"),
                  },
                ],
              },
              {
                path: "remove",
                Component: GroupSettings,
                loader: getMembersLoader("remove"),
                children: [
                  {
                    path: ":memberId",
                    action: getMembersAction("remove"),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
