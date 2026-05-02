import styles from "./StateMessage.module.scss";

type Variant = "loading" | "error" | "empty";

type StateMessageProps = {
  variant: Variant;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function StateMessage({
  variant,
  title,
  description,
  action,
}: StateMessageProps) {
  const isError = variant === "error";

  return (
    <div
      className={`${styles.box} ${styles[variant]}`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
    >
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
