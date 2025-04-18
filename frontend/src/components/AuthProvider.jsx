import PropTypes from "prop-types";
import { use, createContext, useState, useEffect } from "react";
import { getItem, setItem, removeItem } from "../utils/localStorage";

const AuthContext = createContext({
  user: { id: 0, token: "" },
  onLogin: () => {},
  onLogout: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = use(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a descendant of AuthProvider");
  }

  return context;
};

const getUser = () => getItem();

function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser);

  useEffect(() => {
    if (!user) {
      removeItem();
      return;
    }

    setItem(user);
  }, [user]);

  const value = {
    user,
    onLogout: () => setUser(null),
    onLogin: (user) => setUser(user),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node).isRequired,
    PropTypes.node.isRequired,
  ]).isRequired,
};

export default AuthProvider;
