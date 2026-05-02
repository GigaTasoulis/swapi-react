import { Link } from "react-router-dom";
import styles from "./NavCard.module.scss";

type NavCardProps = {
  to: string;
  title: string;
  description: string;
};

export default function NavCard({ to, title, description }: NavCardProps) {
  return (
    <Link to={to} className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
