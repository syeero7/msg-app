import { useState } from "react";
import { Link } from "react-router-dom";
import FormField from "../../components/FormField";
import AuthForm from "../../components/AuthForm";
import { useAuth } from "../../components/AuthProvider";
import { signinUser } from "../../utils/api";
import styles from "./Signin.module.css";

function Signin() {
  const { errors, formAction } = useFormController();

  return (
    <main className={styles.container}>
      <h1 className={styles.text}>Sign-in to your account</h1>
      <AuthForm action={formAction}>
        <FormField
          label="Email"
          name="email"
          type="email"
          error={errors?.email}
          autoComplete="e-mail"
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          error={errors?.email}
          autoComplete="current-password"
        />
        <AuthForm.SubmitButton>Sign-in</AuthForm.SubmitButton>
        <p className={styles.text}>
          Don&apos;t have an account? <Link to="/sign-up">Sign-up</Link>
        </p>
      </AuthForm>
    </main>
  );
}

const useFormController = () => {
  const [errors, setErrors] = useState();
  const { onLogin } = useAuth();

  const formAction = async (formData) => {
    const body = Object.fromEntries(formData);
    const res = await signinUser(body);

    if (res.ok) {
      const { token, user } = await res.json();
      onLogin({ token, id: user.id });
      return;
    }

    const { errors: err } = await res.json();
    setErrors(err);
  };

  return { errors, formAction };
};

export default Signin;
