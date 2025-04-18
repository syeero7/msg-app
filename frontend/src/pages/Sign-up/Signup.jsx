import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import FormField from "../../components/FormField";
import { createUser } from "../../utils/api";
import styles from "./Signup.module.css";

function Signup() {
  const { errors, formAction } = useFormController();

  return (
    <main className={styles.container}>
      <h1 className={styles.text}>Create an account</h1>
      <AuthForm action={formAction}>
        <FormField label="First name" error={errors?.firstName} />
        <FormField label="Last name" error={errors?.lastName} />
        <FormField
          label="Email"
          error={errors?.email}
          type="email"
          autoComplete="e-mail"
        />
        <FormField
          label="Password"
          error={errors?.password}
          type="password"
          autoComplete="new-password"
        />
        <FormField
          label="Confirm password"
          error={errors?.confirmPassword}
          type="password"
          autoComplete="new-password"
        />
        <AuthForm.SubmitButton>Sign-up</AuthForm.SubmitButton>
        <p className={styles.text}>
          Already have an account? <Link to="/sign-in">Sign-in</Link>
        </p>
      </AuthForm>
    </main>
  );
}

const useFormController = () => {
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const formAction = async (formData) => {
    const body = Object.fromEntries(formData);
    const res = await createUser(body);

    if (res.ok) {
      navigate("/sign-in", { replace: true });
      return;
    }

    const { errors: err } = await res.json();
    setErrors(err);
  };

  return { errors, formAction };
};

export default Signup;
