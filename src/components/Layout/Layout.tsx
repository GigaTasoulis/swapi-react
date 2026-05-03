import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/characters", label: "Characters" },
  { to: "/films", label: "Films" },
  { to: "/favourites", label: "Favourites" },
];

export default function Layout() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <span className={styles.brand}>SWAPI</span>
          <nav className={styles.nav} aria-label="Main">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
