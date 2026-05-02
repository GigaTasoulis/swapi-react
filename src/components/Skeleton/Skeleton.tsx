import styles from "./Skeleton.module.scss";

type SkeletonProps = {
  width?: string;
  height?: string;
  className?: string;
};

export default function Skeleton({
  width = "100%",
  height = "1rem",
  className,
}: SkeletonProps) {
  return (
    <span
      className={`${styles.skeleton} ${className ?? ""}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
