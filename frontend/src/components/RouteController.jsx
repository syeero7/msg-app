import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function RouteController({ type }) {
  const { user } = useAuth();

  switch (type) {
    case "public":
      return !user ? <Outlet /> : <Navigate to="/chat/users/all" replace />;

    case "private":
      return user ? <Outlet /> : <Navigate to="/" replace />;
  }
}

RouteController.propTypes = {
  type: (props, propName, componentName) => {
    const property = props[propName];

    if (property !== "PUBLIC" && property !== "PRIVATE") {
      throw new Error(
        `Invalid prop ${propName} passed to ${componentName}. Expected either "public" or "private"`
      );
    }
  },
};

export default RouteController;
