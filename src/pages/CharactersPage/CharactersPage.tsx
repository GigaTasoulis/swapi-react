import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCharactersQuery } from "../../api/swapiApi";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { getIdFromUrl } from "../../utils/getIdFromUrl";
import Card from "../../components/Card/Card";
import CardSkeleton from "../../components/Skeleton/CardSkeleton";
import FavouriteButton from "../../components/FavouriteButton/FavouriteButton";
import Pagination from "../../components/Pagination/Pagination";
import SearchInput from "../../components/SearchInput/SearchInput";
import StateMessage from "../../components/StateMessage/StateMessage";
import styles from "./CharactersPage.module.scss";

export default function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const urlPage = Number(searchParams.get("page")) || 1;

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
    next.delete("page"); // reset page on search change
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, urlSearch, searchParams, setSearchParams]);

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    if (nextPage === 1) {
      next.delete("page"); // keep URL clean when on page 1
    } else {
      next.set("page", String(nextPage));
    }
    setSearchParams(next);
  };

  const { data, isLoading, isError, isFetching, refetch } =
    useGetCharactersQuery({
      page: urlPage,
      search: urlSearch,
    });

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.heading}>Characters</h1>
      </header>

      <SearchInput
        value={search}
        onChange={setSearch}
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
            urlSearch
              ? `No characters match "${urlSearch}"`
              : "No characters found."
          }
          description={
            urlSearch ? "Try a different name or clear the search." : undefined
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
            page={urlPage}
            hasPrevious={Boolean(data.previous) && !isFetching}
            hasNext={Boolean(data.next) && !isFetching}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
