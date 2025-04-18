import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import RouteController from "./components/RouteController";

import Home from "./pages/Home";
import Signin from "./pages/Sign-in";
import Signup from "./pages/Sign-up";

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
        children: [],
      },
    ],
  },
]);

export default router;
