import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import FormField from "../components/FormField";
import { createUser } from "../utils/api";

function Signup() {
  const { errors, formAction } = useFormController();

  return (
    <main className="auth-container">
      <h1 className="auth-text">Create an account</h1>
      <AuthForm action={formAction}>
        <FormField label="First name" name="firstName" error={errors?.firstName} />
        <FormField label="Last name" name="lastName" error={errors?.lastName} />
        <FormField
          label="Email"
          name="email"
          error={errors?.email}
          type="email"
          autoComplete="e-mail"
        />
        <FormField
          label="Password"
          name="password"
          error={errors?.password}
          type="password"
          autoComplete="new-password"
        />
        <FormField
          label="Confirm password"
          name="confirmPassword"
          error={errors?.confirmPassword}
          type="password"
          autoComplete="new-password"
        />
        <AuthForm.SubmitButton>Sign-up</AuthForm.SubmitButton>
        <p className="auth-text">
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
      navigate("/sign-in", { replace: true, viewTransition: true });
      return;
    }

    const { errors: err } = await res.json();
    setErrors(err);
  };

  return { errors, formAction };
};

export default Signup;
