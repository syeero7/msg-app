import PropTypes from "prop-types";
import { useFormStatus } from "react-dom";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import {
  Form,
  Link,
  NavLink,
  useMatch,
  useNavigate,
  useLoaderData,
} from "react-router-dom";
import { deleteGroup } from "../../utils/api";
import styles from "./GroupMembers.module.css";

function GroupMembers() {
  const { group } = useLoaderData();
  const match = useMatch("/groups/:groupId/members/:intent");

  return (
    <main className={styles.container}>
      <header>
        <div>
          <Link to={`/chat/groups/${group.id}`} className="back-btn">
            <ChevronLeft />
          </Link>

          <DeleteGroup groupId={group.id} />
        </div>

        <div className={styles.links}>
          <NavLink to={`/groups/${group.id}/members/add`} viewTransition>
            Add members
          </NavLink>
          <NavLink to={`/groups/${group.id}/members/remove`} viewTransition>
            Remove members
          </NavLink>
        </div>
      </header>
      <hr />

      {match.params.intent === "add" && <AddMembers />}
      {match.params.intent === "remove" && <RemoveMembers />}
    </main>
  );
}

function DeleteGroup({ groupId }) {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const formAction = async (formData) => {
    const res = await deleteGroup(groupId);
    if (!res.ok) throw res;
    navigate("/chat/groups", { replace: true, viewTransition: true });
  };

  const handleSubmit = (e) => {
    if (!confirm("Are you sure you want to delete this group ?")) {
      e.preventDefault();
    }
  };

  return (
    <form action={formAction} className={styles.deleteGroup} onSubmit={handleSubmit}>
      <SubmitButton>Delete group</SubmitButton>
    </form>
  );
}

function AddMembers() {
  const { users } = useLoaderData();

  return (
    <section className={styles.members}>
      {!users.length ? (
        <p className={styles.empty}>No members</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <Member user={user} Icon={Plus} intent="add" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function RemoveMembers() {
  const { members: users } = useLoaderData();

  return (
    <section className={styles.members}>
      {!users.length ? (
        <p className={styles.empty}>No members</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <Member user={user} Icon={Minus} intent="remove" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Member({ user, Icon, intent }) {
  const imageSize = 48;
  const imageType = user.id % 2 === 0 ? "bottts-neutral" : "fun-emoji";
  const imageUrl = user.imageUrl
    ? user.imageUrl
    : `https://api.dicebear.com/9.x/${imageType}/svg?seed=${user.firstName}-${user.id}-U&size=${imageSize}&radius=50`;

  return (
    <article className={styles.member}>
      <img src={imageUrl} alt="avatar" width={48} height={48} />
      <strong>
        {user.firstName} {user.lastName}
      </strong>
      <Form action={user.id.toString()} viewTransition method="post">
        <SubmitButton aria-label={`${intent} member`} className={styles[intent]}>
          <Icon />
        </SubmitButton>
      </Form>
    </article>
  );
}

function SubmitButton({ children, ...props }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" {...props} disabled={pending}>
      {children}
    </button>
  );
}

DeleteGroup.propTypes = {
  groupId: PropTypes.number.isRequired,
};

Member.propTypes = {
  user: PropTypes.object.isRequired,
  Icon: PropTypes.element.isRequired,
  intent: PropTypes.string.isRequired,
};

SubmitButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GroupMembers;
