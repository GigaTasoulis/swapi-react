import styles from "./DetailRow.module.scss";

type DetailRowProps = {
  label: string;
  value: string | number;
};

export default function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className={styles.row}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  );
}
