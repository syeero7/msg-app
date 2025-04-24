import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createGroup } from "../../utils/api";
import styles from "./Groups.module.css";

function Groups() {
  const { groups } = useLoaderData();
  const { error, formAction } = useFormController();

  if (!groups) return null;

  return (
    <section className={styles.container}>
      <header>
        <strong>Groups</strong>

        <form action={formAction}>
          <div className={styles.field}>
            <input
              name="name"
              type="text"
              required
              maxLength={20}
              aria-label="new group name"
              placeholder="My Group"
            />
            <span className={styles.error} aria-live="polite">
              {error && `* ${error.name}`}
            </span>
          </div>
          <SubmitButton />
        </form>
      </header>
      <hr />

      <article className={styles.groups}>
        {!groups.length ? (
          <p>No groups</p>
        ) : (
          <ul>
            {groups.map(({ name, id }) => {
              const imageSize = 48;
              const href = `/chat/groups/${id}`;
              const imageUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${name}-${id}-G&size=${imageSize}&radius=50`;

              return (
                <li key={id}>
                  <NavLink to={href} viewTransition className={styles.contact}>
                    <img src={imageUrl} alt="" height={imageSize} width={imageSize} />
                    <span>{name}</span>
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button aria-label="create" disabled={pending}>
      <Plus />
    </button>
  );
}

const useFormController = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const formAction = async (formData) => {
    const body = Object.fromEntries(formData);
    const res = await createGroup(body);

    if (res.ok) {
      navigate("/chat/groups", { replace: true });
      return;
    }

    const { errors: err } = await res.json();
    console.log(err);

    setError(err);
  };

  return { error, formAction };
};

export default Groups;
