import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetFilmByIdQuery } from "../../api/swapiApi";
import BackLink from "../../components/BackLink/BackLink";
import DetailRow from "../../components/DetailRow/DetailRow";
import StateMessage from "../../components/StateMessage/StateMessage";
import FavouriteButton from "../../components/FavouriteButton/FavouriteButton";
import styles from "./FilmDetailPage.module.scss";

export default function FilmDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, refetch } = useGetFilmByIdQuery(
    id ?? skipToken,
  );

  return (
    <article>
      <BackLink to="/films" label="Back to films" />

      {isLoading && <StateMessage variant="loading" title="Loading film…" />}

      {isError && (
        <StateMessage
          variant="error"
          title="Couldn't load this film"
          description="It may not exist, or the request failed."
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

      {data && (
        <>
          <header className={styles.header}>
            <div>
              <p className={styles.episode}>Episode {data.episode_id}</p>
              <h1 className={styles.heading}>{data.title}</h1>
            </div>
            <FavouriteButton
              item={{
                id: id!,
                type: "film",
                title: data.title,
                url: data.url,
              }}
            />
          </header>
          <section className={styles.crawl} aria-label="Opening crawl">
            {data.opening_crawl.split("\r\n\r\n").map((paragraph, index) => (
              <p key={index}>{paragraph.replace(/\r\n/g, " ")}</p>
            ))}
          </section>

          <dl className={styles.details}>
            <DetailRow label="Director" value={data.director} />
            <DetailRow label="Producer" value={data.producer} />
            <DetailRow label="Released" value={data.release_date} />
            <DetailRow label="Characters" value={data.characters.length} />
            <DetailRow label="Planets" value={data.planets.length} />
            <DetailRow label="Starships" value={data.starships.length} />
            <DetailRow label="Vehicles" value={data.vehicles.length} />
            <DetailRow label="Species" value={data.species.length} />
          </dl>
        </>
      )}
    </article>
  );
}
