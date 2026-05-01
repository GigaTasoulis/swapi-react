import { Link } from "react-router-dom";
import styles from "./BackLink.module.scss";

type BackLinkProps = {
  to: string;
  label: string;
};

export default function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link to={to} className={styles.link}>
      <span aria-hidden="true">←</span> {label}
    </Link>
  );
}
