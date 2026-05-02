import { useAppSelector } from "../../app/hooks";
import { selectFavourites } from "../../features/favourites/favouritesSlice";
import Card from "../../components/Card/Card";
import FavouriteButton from "../../components/FavouriteButton/FavouriteButton";
import StateMessage from "../../components/StateMessage/StateMessage";
import type { FavouriteItem } from "../../types/favourites";
import styles from "./FavouritesPage.module.scss";

export default function FavouritesPage() {
  const favourites = useAppSelector(selectFavourites);

  const characters = favourites.filter((item) => item.type === "character");
  const films = favourites.filter((item) => item.type === "film");

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.heading}>Favourites</h1>
      </header>

      {favourites.length === 0 && (
        <StateMessage
          variant="empty"
          title="No favourites yet"
          description="Star some characters or films to see them here."
        />
      )}

      {characters.length > 0 && (
        <FavouritesSection
          title="Characters"
          items={characters}
          basePath="characters"
        />
      )}

      {films.length > 0 && (
        <FavouritesSection title="Films" items={films} basePath="films" />
      )}
    </section>
  );
}

type FavouritesSectionProps = {
  title: string;
  items: FavouriteItem[];
  basePath: "characters" | "films";
};

function FavouritesSection({ title, items, basePath }: FavouritesSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <Card
            key={`${item.type}-${item.id}`}
            to={`/${basePath}/${item.id}`}
            title={item.title}
            action={<FavouriteButton item={item} />}
          />
        ))}
      </div>
    </section>
  );
}
