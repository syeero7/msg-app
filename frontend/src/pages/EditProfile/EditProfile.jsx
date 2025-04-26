import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useFormStatus } from "react-dom";
import { Trash, Pencil, Save } from "lucide-react";
import Navbar from "../../components/Navbar";
import { updateUserAboutMe, updateUserAvatar, deleteUserAvatar } from "../../utils/api";
import styles from "./EditProfile.module.css";

function EditProfile() {
  const { user } = useLoaderData();

  return (
    <div className={`chat-layout ${styles.reverse}`}>
      <div>
        <Navbar />
        <div className="chat-contacts hide-element"></div>
      </div>

      <div className={"chat-box-container show-element"}>
        <main className={styles.container}>
          <ProfileForm user={user} />
        </main>
      </div>
    </div>
  );
}

function ProfileForm({ user }) {
  const [avatarState, setAvatarState] = useState({ delete: false, upload: false });
  const { errors, formAction } = useFormController(avatarState, user.aboutMe);

  const imageUrl =
    user.imageUrl ||
    `https://api.dicebear.com/9.x/${
      user.id % 2 === 0 ? "bottts-neutral" : "fun-emoji"
    }/svg?seed=${user.firstName}-${user.id}-U&size=${300}&radius=50`;

  return (
    <form action={formAction} className={styles.form}>
      <div>
        <div className={styles.avatar}>
          <img src={imageUrl} alt="avatar" width={300} height={300} />

          <div className={styles.buttons}>
            <button
              type="button"
              aria-label={`${avatarState.delete ? "undo change" : "delete avatar"}`}
              title={`${avatarState.delete ? "undo change" : "delete avatar"}`}
              className={`${styles.deleteBtn} ${avatarState.delete ? styles.active : ""}`}
              disabled={!user.imageUrl}
              onClick={() =>
                setAvatarState((prev) => ({ ...prev, delete: !prev.delete }))
              }>
              <Trash />
            </button>

            <div
              className={`${styles.fileUpload} ${
                avatarState.upload ? styles.active : ""
              }`}>
              <input
                type="file"
                name="avatar"
                aria-label="upload new image"
                accept="image/png, image/jpeg"
                onChange={(e) =>
                  setAvatarState((prev) => ({
                    ...prev,
                    upload: e.target.files?.length > 0 || false,
                  }))
                }
              />
              <Pencil />
            </div>
          </div>
        </div>

        <p>Upload a PNG or JPG under 3 MB. The image should be 300x300</p>
        <span aria-live="polite" className={styles.error}>
          {errors?.avatar && `* ${errors.avatar}`}
        </span>
      </div>

      <div className={styles.aboutMe}>
        <label>
          <span>About me</span>
          <textarea name="aboutMe" defaultValue={user.aboutMe} maxLength={200}></textarea>
          <span aria-live="polite" className={styles.error}>
            {errors?.aboutMe && `* ${errors.aboutMe}`}
          </span>
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div>
      <button type="submit" disabled={pending} className={styles.save}>
        <Save />
      </button>
    </div>
  );
}

const useFormController = (avatarState, prevAboutMe) => {
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const errorResponses = [];

  useEffect(() => {
    if (errors !== null) {
      const timer = setTimeout(() => {
        setErrors(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  const formAction = async (formData) => {
    const body = Object.fromEntries(formData);

    if (avatarState.delete) {
      const res = await deleteUserAvatar();
      !res.ok && errorResponses.push(res);
    }

    if (avatarState.upload) {
      const res = await updateUserAvatar(body.avatar);
      !res.ok && errorResponses.push(res);
    }

    if (body.aboutMe !== prevAboutMe) {
      const res = await updateUserAboutMe({ aboutMe: body.aboutMe });
      !res.ok && errorResponses.push(res);
    }

    if (errorResponses.length === 0) {
      navigate("/profile/edit", { replace: true, viewTransition: true });
      return;
    }

    const errorsArray = await Promise.all(errorResponses.map((res) => res.json()));
    const results = errorsArray.reduce((acc, errObj) => {
      const { errors, message } = errObj;
      return { ...acc, ...(errors || (message && { avatar: message }) || {}) };
    }, {});

    setErrors(results);
  };

  return { errors, formAction };
};

ProfileForm.propTypes = {
  user: PropTypes.object.isRequired,
};

export default EditProfile;
