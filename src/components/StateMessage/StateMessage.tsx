import styles from "./StateMessage.module.scss";

type Variant = "loading" | "error" | "empty";

type StateMessageProps = {
  variant: Variant;
  title: string;
  description?: string;
};

export default function StateMessage({
  variant,
  title,
  description,
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
    </div>
  );
}
