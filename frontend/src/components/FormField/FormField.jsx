import PropTypes from "prop-types";
import styles from "./FormField.module.css";

function FormField({ label, error, name, type = "text", autoComplete }) {
  return (
    <div className={styles.container}>
      <label>
        <span className={styles.label}>{label} </span>

        <input required type={type} name={name} autoComplete={autoComplete} />
      </label>

      <span aria-live="polite" className={styles.error}>
        {error ? `* ${error}` : ""}
      </span>
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
};

export default FormField;
