import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const App = lazy(() => import("./App"));
const RouteController = lazy(() => import("./components/RouteController"));
const Fallback = lazy(() => import("./pages/Fallback"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

const Home = lazy(() => import("./pages/Home"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    HydrateFallback: Fallback,
    ErrorBoundary: ErrorPage,
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
                lazy: async () => {
                  const module = await import("./pages/UserChat");

                  return {
                    Component: module.default,
                    loader: module.getLoader("all"),
                  };
                },
              },
              {
                path: "online",
                lazy: async () => {
                  const module = await import("./pages/UserChat");

                  return {
                    Component: module.default,
                    loader: module.getLoader("online"),
                  };
                },
              },
              {
                path: ":userId",
                lazy: async () => {
                  const module = await import("./pages/UserChat");

                  return {
                    Component: module.default,
                    loader: module.getLoader("messages"),
                  };
                },
              },
            ],
          },
          {
            path: "chat/groups",
            children: [
              {
                index: true,
                lazy: async () => {
                  const module = await import("./pages/GroupChat");

                  return {
                    Component: module.default,
                    loader: module.getLoader("all"),
                  };
                },
              },
              {
                path: ":groupId",
                lazy: async () => {
                  const module = await import("./pages/GroupChat");

                  return {
                    Component: module.default,
                    loader: module.getLoader("messages"),
                  };
                },
              },
            ],
          },
          {
            path: "users/:userId",
            lazy: async () => {
              const module = await import("./pages/UserProfile");

              return {
                Component: module.default,
                loader: module.loader,
              };
            },
          },
          {
            path: "profile/edit",
            lazy: async () => {
              const module = await import("./pages/EditProfile");

              return {
                Component: module.default,
                loader: module.loader,
              };
            },
          },
          {
            path: "groups/:groupId/members",
            children: [
              {
                path: "add",
                lazy: async () => {
                  const module = await import("./pages/GroupSettings");

                  return {
                    Component: module.default,
                    loader: module.getLoader("add"),
                  };
                },
                children: [
                  {
                    path: ":memberId",
                    lazy: async () => {
                      const module = await import("./pages/GroupSettings");

                      return {
                        action: module.getAction("add"),
                      };
                    },
                  },
                ],
              },
              {
                path: "remove",
                lazy: async () => {
                  const module = await import("./pages/GroupSettings");

                  return {
                    Component: module.default,
                    loader: module.getLoader("remove"),
                  };
                },
                children: [
                  {
                    path: ":memberId",
                    lazy: async () => {
                      const module = await import("./pages/GroupSettings");

                      return {
                        action: module.getAction("remove"),
                      };
                    },
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
