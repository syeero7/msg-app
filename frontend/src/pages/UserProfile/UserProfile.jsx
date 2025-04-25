import { Link, useLoaderData, useMatch } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "../../components/Navbar";
import Users from "../../components/Users";
import styles from "./UserProfile.module.css";

function UserProfile() {
  const { params } = useMatch("/users/:userId");
  const hasUserId = /^[0-9]+$/.test(params.userId);

  return (
    <div className={`chat-layout ${hasUserId ? "reverse" : ""}`}>
      <div>
        <Navbar />

        <div className={`chat-contacts ${hasUserId ? "hide-element" : ""}`}>
          <Users />
        </div>
      </div>

      <div className={`chat-box-container ${hasUserId ? "show-element" : ""}`}>
        {hasUserId && <Profile />}
      </div>
    </div>
  );
}

function Profile() {
  const { user } = useLoaderData();

  const imageUrl =
    user.imageUrl ||
    `https://api.dicebear.com/9.x/${
      user.id % 2 === 0 ? "bottts-neutral" : "fun-emoji"
    }/svg?seed=${user.firstName}-${user.id}-U&size=${300}&radius=50`;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Link to={`/chat/users/${user.id}`} viewTransition className="back-btn">
          <ChevronLeft />
        </Link>
      </div>

      <article className={styles.profile}>
        <div className={styles.avatar}>
          <img src={imageUrl} alt="avatar" width={300} height={300} />
        </div>
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <p>{user.aboutMe}</p>
      </article>
    </main>
  );
}

export default UserProfile;
