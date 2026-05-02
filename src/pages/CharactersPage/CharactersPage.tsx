import { useState } from "react";
import { useGetCharactersQuery } from "../../api/swapiApi";
import { getIdFromUrl } from "../../utils/getIdFromUrl";
import Card from "../../components/Card/Card";
import Pagination from "../../components/Pagination/Pagination";
import StateMessage from "../../components/StateMessage/StateMessage";
import FavouriteButton from "../../components/FavouriteButton/FavouriteButton";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import SearchInput from "../../components/SearchInput/SearchInput";
import CardSkeleton from "../../components/Skeleton/CardSkeleton";
import styles from "./CharactersPage.module.scss";

export default function CharactersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading, isError, isFetching, refetch } =
    useGetCharactersQuery({
      page,
      search: debouncedSearch,
    });

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.heading}>Characters</h1>
      </header>

      <SearchInput
        value={search}
        onChange={handleSearchChange}
        label="Search characters"
        placeholder="Search by name…"
      />

      {isLoading && (
        <div
          className={styles.grid}
          role="status"
          aria-label="Loading characters"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <StateMessage
          variant="error"
          title="Couldn't load characters"
          description="Please try again in a moment."
          action={
            <button
              type="button"
              className={styles.retry}
              onClick={() => refetch()}
            >
              Try again
            </button>
          }
        />
      )}

      {data && data.results.length === 0 && (
        <StateMessage
          variant="empty"
          title={
            debouncedSearch
              ? `No characters match "${debouncedSearch}"`
              : "No characters found."
          }
          description={
            debouncedSearch
              ? "Try a different name or clear the search."
              : undefined
          }
        />
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
                  action={
                    <FavouriteButton
                      item={{
                        id,
                        type: "character",
                        title: character.name,
                        url: character.url,
                      }}
                    />
                  }
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
