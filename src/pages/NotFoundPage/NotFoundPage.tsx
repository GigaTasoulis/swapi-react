import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.scss";

export default function NotFoundPage() {
  return (
    <section className={styles.wrapper}>
      <p className={styles.code}>404</p>
      <h1 className={styles.heading}>Lost in hyperspace</h1>
      <p className={styles.message}>
        The page you're looking for doesn't exist. Maybe it never did, in any
        galaxy.
      </p>
      <Link to="/" className={styles.link}>
        ← Back to home
      </Link>
    </section>
  );
}
