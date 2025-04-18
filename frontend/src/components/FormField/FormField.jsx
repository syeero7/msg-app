import PropTypes from "prop-types";
import styles from "./FormField.module.css";

function FormField({ label, error, type = "text", autoComplete }) {
  return (
    <div className={styles.container}>
      <label>
        <span className={styles.label}>{label} </span>

        <input
          required
          type={type}
          name={createNameFromLabel(label)}
          autoComplete={autoComplete}
        />
      </label>

      <span aria-live="polite" className={styles.error}>
        {error ? `* ${error}` : ""}
      </span>
    </div>
  );
}

const createNameFromLabel = (label) => {
  const words = label.split(" ").map((word, i) => {
    word = word.toLowerCase();
    if (i > 0) word = word[0].toUpperCase() + word.slice(1);
    return word;
  });

  return words.join("");
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
};

export default FormField;
