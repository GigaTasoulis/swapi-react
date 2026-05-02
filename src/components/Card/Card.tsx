import { Link } from "react-router-dom";
import styles from "./Card.module.scss";

type CardProps = {
  to: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function Card({ to, title, subtitle, action }: CardProps) {
  return (
    <Link to={to} className={styles.card}>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </Link>
  );
}
