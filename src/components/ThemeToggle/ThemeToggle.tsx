import { useTheme } from "../../hooks/useTheme";
import type { Theme } from "../../hooks/useTheme";
import styles from "./ThemeToggle.module.scss";

const options: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Light mode", icon: "☀️" },
  { value: "system", label: "System mode", icon: "💻" },
  { value: "dark", label: "Dark mode", icon: "🌙" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.group} role="radiogroup" aria-label="Theme">
      {options.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          className={`${styles.option} ${theme === value ? styles.active : ""}`}
          onClick={() => setTheme(value)}
        >
          <span aria-hidden="true">{icon}</span>
        </button>
      ))}
    </div>
  );
}
