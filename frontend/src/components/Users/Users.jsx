import { NavLink, useLoaderData } from "react-router-dom";
import styles from "./Users.module.css";

function Users() {
  const { users } = useLoaderData();

  if (!users) return null;

  return (
    <section className={styles.container}>
      <header>
        <strong>Users</strong>

        <div className={styles.links}>
          <NavLink to="/chat/users/all" viewTransition>
            all
          </NavLink>

          <NavLink to="/chat/users/online" viewTransition>
            online
          </NavLink>
        </div>
      </header>

      <hr />

      <article className={styles.users}>
        {!users.length ? (
          <p>No users</p>
        ) : (
          <ul>
            {users.map(({ firstName, lastName, imageUrl, id }) => {
              const imageSize = 48;
              const href = `/chat/users/${id}`;
              const imageType = id % 2 === 0 ? "bottts-neutral" : "fun-emoji";
              imageUrl = imageUrl
                ? imageUrl
                : `https://api.dicebear.com/9.x/${imageType}/svg?seed=${firstName}-${id}-U&size=${imageSize}&radius=50`;

              return (
                <li key={id}>
                  <NavLink to={href} viewTransition className={styles.contact}>
                    <img src={imageUrl} alt="" height={imageSize} width={imageSize} />
                    <span>
                      {firstName} {lastName}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </article>
    </section>
  );
}

export default Users;
