import NavCard from "../../components/NavCard/NavCard";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  return (
    <section>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Star Wars Explorer</p>
        <h1 className={styles.heading}>Welcome</h1>
        <p className={styles.subheading}>
          Browse characters and films from a galaxy far, far away.
        </p>
      </header>

      <div className={styles.grid}>
        <NavCard
          to="/characters"
          title="Characters"
          description="Heroes, villains, droids and bounty hunters. Search and explore the people who shaped the galaxy."
        />
        <NavCard
          to="/films"
          title="Films"
          description="The original trilogy, the prequels and beyond — every film with its director, release date and opening crawl."
        />
        <NavCard
          to="/favourites"
          title="Favourites"
          description="Your saved characters and films, ready whenever you come back."
        />
      </div>
    </section>
  );
}
