import { useGetFilmsQuery } from "../../api/swapiApi";
import { getIdFromUrl } from "../../utils/getIdFromUrl";
import Card from "../../components/Card/Card";
import StateMessage from "../../components/StateMessage/StateMessage";
import styles from "./FilmsPage.module.scss";

export default function FilmsPage() {
  const { data, isLoading, isError } = useGetFilmsQuery({ search: "" });

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.heading}>Films</h1>
      </header>

      {isLoading && <StateMessage variant="loading" title="Loading films…" />}

      {isError && (
        <StateMessage
          variant="error"
          title="Couldn't load films"
          description="Please try again in a moment."
        />
      )}

      {data && data.results.length === 0 && (
        <StateMessage variant="empty" title="No films found." />
      )}

      {data && data.results.length > 0 && (
        <div className={styles.grid}>
          {data.results.map((film) => {
            const id = getIdFromUrl(film.url);
            return (
              <Card
                key={film.url}
                to={`/films/${id}`}
                title={film.title}
                subtitle={`Directed by ${film.director} · ${film.release_date}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
