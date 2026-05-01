import { useState } from "react";
import { useGetCharactersQuery } from "../../api/swapiApi";
import { getIdFromUrl } from "../../utils/getIdFromUrl";
import Card from "../../components/Card/Card";
import Pagination from "../../components/Pagination/Pagination";
import StateMessage from "../../components/StateMessage/StateMessage";
import styles from "./CharactersPage.module.scss";

export default function CharactersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useGetCharactersQuery({
    page,
    search: "",
  });

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.heading}>Characters</h1>
      </header>

      {isLoading && (
        <StateMessage variant="loading" title="Loading characters…" />
      )}

      {isError && (
        <StateMessage
          variant="error"
          title="Couldn't load characters"
          description="Please try again in a moment."
        />
      )}

      {data && data.results.length === 0 && (
        <StateMessage variant="empty" title="No characters found." />
      )}

      {data && data.results.length > 0 && (
        <>
          <div className={styles.grid} aria-busy={isFetching}>
            {data.results.map((character) => {
              const id = getIdFromUrl(character.url);
              return (
                <Card
                  key={character.url}
                  to={`/characters/${id}`}
                  title={character.name}
                  subtitle={`Born ${character.birth_year}`}
                />
              );
            })}
          </div>

          <Pagination
            page={page}
            hasPrevious={Boolean(data.previous)}
            hasNext={Boolean(data.next)}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
