import Skeleton from "./Skeleton";
import styles from "./CardSkeleton.module.scss";

export default function CardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.body}>
        <Skeleton width="70%" height="1.25rem" className={styles.title} />
        <Skeleton width="40%" height="0.875rem" />
      </div>
      <Skeleton width="2.25rem" height="2.25rem" className={styles.action} />
    </div>
  );
}
