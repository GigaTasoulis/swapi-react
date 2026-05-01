import styles from "./Pagination.module.scss";

type PaginationProps = {
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  hasPrevious,
  hasNext,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious}
      >
        ← Previous
      </button>

      <span className={styles.indicator} aria-live="polite">
        Page {page}
      </span>

      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
      >
        Next →
      </button>
    </nav>
  );
}
