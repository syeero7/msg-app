import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import styles from "./Home.module.css";

function Home() {
  return (
    <main className={styles.container}>
      <article>
        <div>
          <img src={logo} alt="app logo" />
        </div>

        <div className={styles.links}>
          <Link to="sign-in">Sign-in</Link>
          <Link to="sign-up">Sign-up</Link>
        </div>
      </article>
    </main>
  );
}

export default Home;
