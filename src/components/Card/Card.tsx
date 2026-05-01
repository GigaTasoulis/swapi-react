import { Link } from "react-router-dom";
import styles from "./Card.module.scss";

type CardProps = {
  to: string;
  title: string;
  subtitle?: string;
};

export default function Card({ to, title, subtitle }: CardProps) {
  return (
    <Link to={to} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </Link>
  );
}
