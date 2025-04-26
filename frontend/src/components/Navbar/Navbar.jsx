import { LogOut, Users, LayoutGrid, UserPen } from "lucide-react";
import { NavLink, useMatch } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import styles from "./Navbar.module.css";

function Navbar() {
  const match = useMatch("/chat/users/:pattern");
  const { onLogout } = useAuth();

  const handleClick = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      onLogout();
    }
  };

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink
            to="/chat/users/all"
            viewTransition
            className={`${styles.item} ${match ? "active" : ""}`}>
            <Users />
            <span>Users</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/chat/groups" className={styles.item} viewTransition>
            <LayoutGrid />
            <span>Groups</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile/edit" className={styles.item} viewTransition>
            <UserPen />
            <span>Edit profile</span>
          </NavLink>
        </li>

        <li>
          <button onClick={handleClick} className={styles.item}>
            <LogOut />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
