import { useRouteError, Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";

function ErrorPage() {
  const error = useRouteError();

  return (
    <div className={styles.container}>
      <div>
        <h1>Oops! Something went wrong!</h1>

        <article className={styles.content}>
          <p>{error.message || `${error.status} ${error.statusText}`}</p>

          <p>
            Back to{" "}
            <Link viewTransition to="/">
              home
            </Link>
          </p>
        </article>
      </div>
    </div>
  );
}

export default ErrorPage;
