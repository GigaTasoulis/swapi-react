import { useGetFilmsQuery } from "../../api/swapiApi";
import { getIdFromUrl } from "../../utils/getIdFromUrl";
import Card from "../../components/Card/Card";
import StateMessage from "../../components/StateMessage/StateMessage";
import FavouriteButton from "../../components/FavouriteButton/FavouriteButton";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import SearchInput from "../../components/SearchInput/SearchInput";
import CardSkeleton from "../../components/Skeleton/CardSkeleton";
import styles from "./FilmsPage.module.scss";
import { useSearchParams } from "react-router-dom";

export default function FilmsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      next.set("search", debouncedSearch);
    } else {
      next.delete("search");
    }
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, urlSearch, searchParams, setSearchParams]);

  const { data, isLoading, isError, refetch } = useGetFilmsQuery({
    search: urlSearch,
  });

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.heading}>Films</h1>
      </header>

      <SearchInput
        value={search}
        onChange={setSearch}
        label="Search films"
        placeholder="Search by title…"
      />

      {isLoading && (
        <div className={styles.grid} role="status" aria-label="Loading films">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <StateMessage
          variant="error"
          title="Couldn't load films"
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
              ? `No films match "${debouncedSearch}"`
              : "No films found."
          }
          description={
            debouncedSearch
              ? "Try a different title or clear the search."
              : undefined
          }
        />
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
                action={
                  <FavouriteButton
                    item={{
                      id,
                      type: "film",
                      title: film.title,
                      url: film.url,
                    }}
                  />
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
