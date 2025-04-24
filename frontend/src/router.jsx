import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import RouteController from "./components/RouteController";

import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import UserChat, { getLoader as getUserChatLoader } from "./pages/UserChat";
import GroupChat, { getLoader as getGroupChatLoader } from "./pages/GroupChat";

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
        ],
      },
    ],
  },
]);

export default router;
