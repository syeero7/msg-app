import PropTypes from "prop-types";
import { useFormStatus } from "react-dom";
import styles from "./AuthForm.module.css";

function AuthForm({ action, children }) {
  return (
    <form action={action} className={styles.form}>
      {children}
    </form>
  );
}

function Button({ children }) {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className={styles.button}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.node.isRequired])
    .isRequired,
};

AuthForm.propTypes = {
  action: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node).isRequired,
    PropTypes.node.isRequired,
  ]).isRequired,
};

AuthForm.SubmitButton = Button;

export default AuthForm;
