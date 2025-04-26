import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { formatRelative } from "date-fns";
import { enUS } from "date-fns/locale";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { CornerUpLeft, Settings, ChevronLeft, Send, Camera } from "lucide-react";
import {
  sendDirectMessage,
  sendGroupMessages,
  updateGroupMembers,
} from "../../utils/api";
import { useAuth } from "../AuthProvider";
import styles from "./Chat.module.css";

function Chat({ messageType }) {
  const { user } = useAuth();
  const { messages, data } = useLoaderData();
  const scrollRef = useScrollToBottom(messages.length);
  const recipientType = messageType === "direct" ? "user" : "group";

  return (
    <main className={styles.container}>
      <MessageBoxHeader data={data} recipientType={recipientType} userId={user.id} />

      <section className={styles.messages}>
        {!messages.length ? (
          <p className={styles.empty}>No messages</p>
        ) : (
          <ul ref={scrollRef}>
            {messages.map(({ id, senderId, createdAt, ...message }) => {
              return (
                <li key={id}>
                  <article
                    className={senderId === user.id ? styles.sender : styles.recipient}>
                    {message.text ? (
                      <p className={styles.text}>{message.text}</p>
                    ) : (
                      <div className={styles.image}>
                        <img
                          src={message.imageUrl}
                          alt="image"
                          width={200}
                          height={200}
                        />
                      </div>
                    )}

                    <time dateTime={createdAt} className={styles.time}>
                      {formatRelative(createdAt, new Date(), { locale: enUS })}
                    </time>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <MessageForm recipientId={data.id} recipientType={recipientType} />
    </main>
  );
}

function MessageBoxHeader({ recipientType, data, userId }) {
  const navigate = useNavigate();

  const isUser = recipientType === "user";
  const isGroup = recipientType === "group";
  const isCreator = data.creatorId === userId;

  const handleClick = isCreator
    ? null
    : async () => {
        const res = await updateGroupMembers(data.id, { add: [], remove: [userId] });
        if (!res.ok) throw res;
        navigate("/chat/groups", { replace: true, viewTransition: true });
      };

  return (
    <header className={styles.header}>
      <div>
        <Link
          to={`/chat/${recipientType}s${isUser ? "/all" : ""}`}
          className="back-btn"
          viewTransition>
          <ChevronLeft />
        </Link>

        <h1>
          {isUser && (
            <Link to={`/users/${data.id}`} viewTransition>
              {`${data.firstName} ${data.lastName}`}
            </Link>
          )}

          {isGroup && data.name}
        </h1>
      </div>

      {isGroup && (
        <div>
          {isCreator ? (
            <Link to={`/groups/${data.id}`} viewTransition>
              <Settings />
            </Link>
          ) : (
            <button
              aria-label="leave the group"
              title="leave"
              className={styles.leave}
              onClick={handleClick}>
              <CornerUpLeft />
            </button>
          )}
        </div>
      )}
    </header>
  );
}

function MessageForm({ recipientType, recipientId }) {
  const [hasFile, setHasFile] = useState(false);
  const { error, formAction } = useFormController(recipientType, recipientId);
  const ref = useRef();

  const handleSubmit = (e) => {
    if (ref.current?.value.trim().length === 0 && !hasFile) {
      e.preventDefault();
    }
  };

  return (
    <form action={formAction} className={styles.form} onSubmit={handleSubmit}>
      <div>
        <div>
          <div className={`${styles.fileInput} ${hasFile ? styles.hasFile : ""}`}>
            <Camera />
            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg"
              onChange={(e) => setHasFile(e.target.files?.length > 0 || false)}
            />
          </div>

          <textarea
            ref={ref}
            name="text"
            aria-label="message"
            style={{ width: "100%" }}></textarea>
        </div>

        <span className={styles.error} aria-live="polite">
          {error && `* ${error?.message || error?.text}`}
        </span>
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-label="send" disabled={pending}>
      <Send />
    </button>
  );
}

const useFormController = (recipientType, recipientId) => {
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
    let fetchSuccessful = false;
    let errorResponse;
    const sendMessage = recipientType === "group" ? sendGroupMessages : sendDirectMessage;

    const body = Object.fromEntries(formData);

    if (body.image.size > 0) {
      const res = await sendMessage(recipientId, body.image, "image");
      res.ok ? (fetchSuccessful = true) : (errorResponse = res);
    }

    if (body.text) {
      const res = await sendMessage(recipientId, body.text, "text");
      res.ok ? (fetchSuccessful = true) : (errorResponse = res);
    }

    if (fetchSuccessful) {
      navigate(`/chat/${recipientType}s/${recipientId}`, {
        replace: true,
        viewTransition: true,
      });
      return;
    }

    const { errors, message } = await errorResponse.json();

    setError(errors || message);
  };

  return { error, formAction };
};

const useScrollToBottom = (messagesCount) => {
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ block: "end" });
    }
  }, [messagesCount]);

  return scrollRef;
};

Chat.propTypes = {
  messageType: PropTypes.string.isRequired,
};

MessageBoxHeader.propTypes = {
  data: PropTypes.object.isRequired,
  userId: PropTypes.number.isRequired,
  recipientType: PropTypes.string.isRequired,
};

MessageForm.propTypes = {
  recipientType: PropTypes.string.isRequired,
  recipientId: PropTypes.number.isRequired,
};

export default Chat;
